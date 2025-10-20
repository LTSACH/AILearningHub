/**
 * Interactive Metrics Walkthrough
 * Handles step-by-step calculation visualization from confusion matrix
 */

// Store state for each walkthrough instance
const walkthroughStates = {};

/**
 * Initialize walkthrough for a specific method
 * @param {string} methodId - Unique identifier for the method
 * @param {Array} cm - Confusion matrix
 * @param {Array} labels - Class labels
 */
function initWalkthrough(methodId, cm, labels) {
    // Pre-calculate all metrics
    const diagonal = cm.map((row, i) => row[i]);
    const rowSums = cm.map(row => row.reduce((a, b) => a + b, 0));
    const colSums = cm[0].map((_, j) => cm.reduce((sum, row) => sum + row[j], 0));
    const total = rowSums.reduce((a, b) => a + b, 0);
    
    const recall = diagonal.map((tp, i) => tp / rowSums[i]);
    const precision = diagonal.map((tp, i) => tp / colSums[i]);
    const f1 = diagonal.map((tp, i) => (2 * tp) / (rowSums[i] + colSums[i]));
    
    const weights = rowSums.map(s => s / total);
    const recallMacro = recall.reduce((a, b) => a + b, 0) / recall.length;
    const precisionMacro = precision.reduce((a, b) => a + b, 0) / precision.length;
    const recallWeighted = recall.reduce((sum, r, i) => sum + r * weights[i], 0);
    const precisionWeighted = precision.reduce((sum, p, i) => sum + p * weights[i], 0);
    const f1Macro = f1.reduce((a, b) => a + b, 0) / f1.length;
    const f1Weighted = f1.reduce((sum, f, i) => sum + f * weights[i], 0);
    const accuracy = diagonal.reduce((a, b) => a + b, 0) / total;
    
    // Build extended matrix HTML
    const matrixHTML = buildExtendedMatrix(cm, labels, methodId);
    document.getElementById(`wt-matrix-${methodId}`).outerHTML = matrixHTML;
    
    // Define steps
    const steps = [
        {
            title: "Introduction: Confusion Matrix",
            description: "This is the confusion matrix showing predicted vs actual labels. We'll calculate all metrics step-by-step.",
            highlight: () => clearHighlights(methodId),
            content: () => `
                <p style="color: #666; line-height: 1.8;">
                    The confusion matrix shows:<br>
                    • <strong>Rows</strong> = Actual classes<br>
                    • <strong>Columns</strong> = Predicted classes<br>
                    • <strong>Diagonal</strong> = Correct predictions<br>
                    • <strong>Off-diagonal</strong> = Errors<br><br>
                    We'll extract various metrics from this matrix.
                </p>
            `
        },
        {
            title: "Extract Diagonal (TP)",
            description: "True Positives (TP): Diagonal values represent correctly classified samples for each class.",
            highlight: () => {
                clearHighlights(methodId);
                clearExtraCells(methodId);
                diagonal.forEach((val, i) => highlightCell(methodId, i, i, 'diagonal'));
            },
            content: () => {
                const cards = diagonal.map((tp, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${tp}</div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(\\text{TP}_i = \\text{CM}[i][i]\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                `;
            }
        },
        {
            title: "Calculate Row Sums (Support)",
            description: "Support: Sum each row to get total actual samples per class. Each row is highlighted with a unique color.",
            highlight: () => {
                clearHighlights(methodId);
                clearExtraCells(methodId);
                cm.forEach((row, i) => {
                    row.forEach((val, j) => highlightCell(methodId, i, j, 'row', i));
                    fillExtraCell(methodId, `support="${i}"`, rowSums[i]);
                });
            },
            content: () => {
                const cards = rowSums.map((sum, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${sum}</div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(\\text{Support}_i = \\sum_j \\text{CM}[i][j]\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                    <p style="margin-top: 1rem; color: #666;">Total: ${total} samples</p>
                    <p style="margin-top: 0.5rem; color: #10b981; font-weight: 600;">
                        ✓ Values filled into Support column
                    </p>
                `;
            }
        },
        {
            title: "Calculate Recall per Class",
            description: "Recall = TP / Support. Shows how well we detect each class.",
            highlight: () => {
                clearHighlights(methodId);
                diagonal.forEach((val, i) => {
                    highlightCell(methodId, i, i, 'diagonal');
                    fillExtraCell(methodId, `support="${i}"`, rowSums[i]);
                    fillExtraCell(methodId, `recall="${i}"`, recall[i], true);
                });
            },
            content: () => {
                const cards = recall.map((r, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${(r * 100).toFixed(1)}%</div>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">
                            ${diagonal[i]} / ${rowSums[i]}
                        </div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(\\text{Recall}_i = \\frac{\\text{TP}_i}{\\text{Support}_i}\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                    <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                        ✓ Values filled into Recall column
                    </p>
                `;
            }
        },
        {
            title: "Calculate Column Sums (Predicted)",
            description: "Predicted: Sum each column to get total predicted samples per class. Each column is highlighted with a unique color.",
            highlight: () => {
                clearHighlights(methodId);
                cm.forEach((row, i) => {
                    row.forEach((val, j) => highlightCell(methodId, i, j, 'column', j));
                });
                colSums.forEach((sum, i) => fillExtraCell(methodId, `predicted="${i}"`, sum));
            },
            content: () => {
                const cards = colSums.map((sum, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${sum}</div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(\\text{Predicted}_i = \\sum_j \\text{CM}[j][i]\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                    <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                        ✓ Values filled into Predicted row (bottom)
                    </p>
                `;
            }
        },
        {
            title: "Calculate Precision per Class",
            description: "Precision = TP / Predicted. Shows prediction accuracy for each class.",
            highlight: () => {
                clearHighlights(methodId);
                diagonal.forEach((val, i) => {
                    highlightCell(methodId, i, i, 'diagonal');
                });
                colSums.forEach((sum, i) => {
                    fillExtraCell(methodId, `predicted="${i}"`, sum);
                    fillExtraCell(methodId, `precision="${i}"`, precision[i], true);
                });
            },
            content: () => {
                const cards = precision.map((p, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${(p * 100).toFixed(1)}%</div>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">
                            ${diagonal[i]} / ${colSums[i]}
                        </div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(\\text{Precision}_i = \\frac{\\text{TP}_i}{\\text{Predicted}_i}\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                    <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                        ✓ Values filled into Precision row (bottom)
                    </p>
                `;
            }
        },
        {
            title: "Calculate F1-Score per Class",
            description: "F1-Score: Harmonic mean of Precision and Recall. Formula: 2 × CM[i,i] / (support_i + predicted_i)",
            highlight: () => {
                clearHighlights(methodId);
                diagonal.forEach((val, i) => {
                    highlightCell(methodId, i, i, 'diagonal');
                });
                rowSums.forEach((sum, i) => fillExtraCell(methodId, `support="${i}"`, sum));
                recall.forEach((r, i) => fillExtraCell(methodId, `recall="${i}"`, r, true));
                colSums.forEach((sum, i) => fillExtraCell(methodId, `predicted="${i}"`, sum));
                precision.forEach((p, i) => fillExtraCell(methodId, `precision="${i}"`, p, true));
            },
            content: () => {
                const cards = f1.map((f, i) => `
                    <div class="wt-class-card">
                        <div class="class-name">${labels[i]}</div>
                        <div class="class-value">${(f * 100).toFixed(1)}%</div>
                        <div style="font-size: 0.75rem; color: #666; margin-top: 0.25rem;">
                            2×${diagonal[i]} / (${rowSums[i]}+${colSums[i]})
                        </div>
                    </div>
                `).join('');
                return `
                    <div class="wt-formula">
                        \\(F1_i = \\frac{2 \\times \\text{CM}[i,i]}{\\text{Support}_i + \\text{Predicted}_i}\\)
                    </div>
                    <div class="wt-per-class-results">${cards}</div>
                `;
            }
        },
        {
            title: "Recall (Macro Average)",
            description: "Macro average treats all classes equally. Simple average of per-class recalls.",
            highlight: () => {
                clearHighlights(methodId);
                recall.forEach((r, i) => fillExtraCell(methodId, `recall="${i}"`, r, true));
                fillExtraCell(methodId, `recall-macro`, recallMacro, true);
            },
            content: () => `
                <div class="wt-formula">
                    \\(\\text{Recall}_{\\text{macro}} = \\frac{1}{n} \\sum_i \\text{Recall}_i\\)
                </div>
                <p style="margin: 1rem 0; color: #666;">
                    = (${recall.map(r => (r * 100).toFixed(1) + '%').join(' + ')}) / ${labels.length}
                </p>
                <div class="wt-result-card">
                    <div class="label">Recall (Macro Average)</div>
                    <div class="value">${(recallMacro * 100).toFixed(2)}%</div>
                </div>
                <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                    ✓ Value filled into Recall column
                </p>
            `
        },
        {
            title: "Recall (Weighted Average)",
            description: "Weighted average gives more importance to classes with more samples.",
            highlight: () => {
                clearHighlights(methodId);
                rowSums.forEach((sum, i) => fillExtraCell(methodId, `support="${i}"`, sum));
                recall.forEach((r, i) => fillExtraCell(methodId, `recall="${i}"`, r, true));
                fillExtraCell(methodId, `recall-macro`, recallMacro, true);
                fillExtraCell(methodId, `support-weighted`, recallWeighted, true);
            },
            content: () => `
                <div class="wt-formula">
                    \\(\\text{Recall}_{\\text{weighted}} = \\sum_i (\\text{Recall}_i \\times w_i)\\)
                </div>
                <div class="wt-result-card">
                    <div class="label">Recall (Weighted Average)</div>
                    <div class="value">${(recallWeighted * 100).toFixed(2)}%</div>
                </div>
                <p style="margin-top: 1rem; color: #10b981; font-weight: 600;">
                    ✓ Value filled into Support column
                </p>
            `
        },
        {
            title: "Precision (Macro & Weighted)",
            description: "Calculate macro and weighted averages for precision.",
            highlight: () => {
                clearHighlights(methodId);
                precision.forEach((p, i) => fillExtraCell(methodId, `precision="${i}"`, p, true));
                recall.forEach((r, i) => fillExtraCell(methodId, `recall="${i}"`, r, true));
                fillExtraCell(methodId, `recall-macro`, recallMacro, true);
                fillExtraCell(methodId, `precision-macro`, precisionMacro, true);
                fillExtraCell(methodId, `support-weighted`, recallWeighted, true);
                fillExtraCell(methodId, `precision-weighted`, precisionWeighted, true);
            },
            content: () => `
                <div style="display: grid; gap: 1rem;">
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <div class="label">Precision (Macro)</div>
                        <div class="value">${(precisionMacro * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <div class="label">Precision (Weighted)</div>
                        <div class="value">${(precisionWeighted * 100).toFixed(2)}%</div>
                    </div>
                </div>
            `
        },
        {
            title: "Calculate Accuracy",
            description: "Accuracy = Sum of diagonal / Total samples. Simple but misleading for imbalanced datasets.",
            highlight: () => {
                clearHighlights(methodId);
                diagonal.forEach((val, i) => highlightCell(methodId, i, i, 'diagonal'));
                fillExtraCell(methodId, `recall-macro`, recallMacro, true);
                fillExtraCell(methodId, `support-weighted`, recallWeighted, true);
                fillExtraCell(methodId, `precision-macro`, precisionMacro, true);
                fillExtraCell(methodId, `precision-weighted`, precisionWeighted, true);
                fillExtraCell(methodId, `accuracy`, accuracy, true);
            },
            content: () => `
                <div class="wt-formula">
                    \\(\\text{Accuracy} = \\frac{\\sum_i \\text{CM}[i,i]}{\\text{Total}} = \\frac{${diagonal.join(' + ')}}{${total}}\\)
                </div>
                <div class="wt-result-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                    <div class="label">Accuracy</div>
                    <div class="value">${(accuracy * 100).toFixed(2)}%</div>
                </div>
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                    <strong style="color: #d97706;">⚠️ Important:</strong>
                    <p style="color: #666; margin-top: 0.5rem; line-height: 1.6;">
                        Accuracy is NOT reliable for imbalanced datasets!<br>
                        ✓ Use Precision, Recall, F1-Score instead.
                    </p>
                </div>
            `
        },
        {
            title: "Summary: All Metrics",
            description: "Complete extended confusion matrix with all calculated metrics.",
            highlight: () => {
                clearHighlights(methodId);
                rowSums.forEach((sum, i) => fillExtraCell(methodId, `support="${i}"`, sum));
                recall.forEach((r, i) => fillExtraCell(methodId, `recall="${i}"`, r, true));
                colSums.forEach((sum, i) => fillExtraCell(methodId, `predicted="${i}"`, sum));
                precision.forEach((p, i) => fillExtraCell(methodId, `precision="${i}"`, p, true));
                fillExtraCell(methodId, `recall-macro`, recallMacro, true);
                fillExtraCell(methodId, `support-weighted`, recallWeighted, true);
                fillExtraCell(methodId, `precision-macro`, precisionMacro, true);
                fillExtraCell(methodId, `precision-weighted`, precisionWeighted, true);
                fillExtraCell(methodId, `accuracy`, accuracy, true);
            },
            content: () => `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-size: 0.9rem;">
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <div class="label">Accuracy</div>
                        <div class="value" style="font-size: 1.5rem;">${(accuracy * 100).toFixed(2)}%</div>
                    </div>
                    <div></div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <div class="label">Recall (Macro)</div>
                        <div class="value" style="font-size: 1.3rem;">${(recallMacro * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <div class="label">Recall (Weighted)</div>
                        <div class="value" style="font-size: 1.3rem;">${(recallWeighted * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <div class="label">Precision (Macro)</div>
                        <div class="value" style="font-size: 1.3rem;">${(precisionMacro * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <div class="label">Precision (Weighted)</div>
                        <div class="value" style="font-size: 1.3rem;">${(precisionWeighted * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <div class="label">F1 (Macro)</div>
                        <div class="value" style="font-size: 1.3rem;">${(f1Macro * 100).toFixed(2)}%</div>
                    </div>
                    <div class="wt-result-card" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <div class="label">F1 (Weighted)</div>
                        <div class="value" style="font-size: 1.3rem;">${(f1Weighted * 100).toFixed(2)}%</div>
                    </div>
                </div>
            `
        }
    ];
    
    // Store state
    walkthroughStates[methodId] = {
        currentStep: 0,
        steps: steps,
        cm, labels, diagonal, rowSums, colSums, total,
        recall, precision, f1, weights,
        recallMacro, precisionMacro, recallWeighted, precisionWeighted,
        f1Macro, f1Weighted, accuracy
    };
    
    // Show first step
    showStep(methodId, 0);
}

function showStep(methodId, stepIndex) {
    const state = walkthroughStates[methodId];
    if (!state || stepIndex < 0 || stepIndex >= state.steps.length) return;
    
    state.currentStep = stepIndex;
    const step = state.steps[stepIndex];
    
    // Update UI
    document.getElementById(`wt-step-num-${methodId}`).textContent = stepIndex + 1;
    document.getElementById(`wt-step-title-${methodId}`).textContent = step.title;
    document.getElementById(`wt-step-desc-${methodId}`).textContent = step.description;
    
    // Highlight matrix
    step.highlight();
    
    // Show calculations
    document.getElementById(`wt-calc-${methodId}`).innerHTML = step.content();
    
    // Render math
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.getElementById(`wt-calc-${methodId}`), {
            delimiters: [
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ]
        });
    }
    
    // Update progress
    const progress = ((stepIndex + 1) / state.steps.length) * 100;
    document.getElementById(`wt-progress-${methodId}`).style.width = progress + '%';
    document.getElementById(`wt-progress-text-${methodId}`).textContent = 
        `Step ${stepIndex + 1}/${state.steps.length}: ${step.title}`;
}

function wtNextStep(methodId) {
    const state = walkthroughStates[methodId];
    if (!state) return;
    if (state.currentStep < state.steps.length - 1) {
        showStep(methodId, state.currentStep + 1);
    }
}

function wtPrevStep(methodId) {
    const state = walkthroughStates[methodId];
    if (!state) return;
    if (state.currentStep > 0) {
        showStep(methodId, state.currentStep - 1);
    }
}

function wtReset(methodId) {
    showStep(methodId, 0);
}

// Helper functions
function buildExtendedMatrix(cm, labels, methodId) {
    let html = `<table class="wt-cm-table">
        <thead>
            <tr>
                <th>Actual \\ Pred</th>
                ${labels.map(l => `<th>${l}</th>`).join('')}
                <th class="separator"></th>
                <th class="extra-col">Support</th>
                <th class="extra-col">Recall</th>
            </tr>
        </thead>
        <tbody>`;
    
    // Main matrix rows
    cm.forEach((row, i) => {
        html += `<tr>
            <th>${labels[i]}</th>
            ${row.map((val, j) => `<td data-row="${i}" data-col="${j}">${val}</td>`).join('')}
            <td class="separator"></td>
            <td class="extra-col" data-support="${i}">?</td>
            <td class="extra-col" data-recall="${i}">?</td>
        </tr>`;
    });
    
    // Separator row
    html += `<tr class="separator-row">
        <td colspan="${labels.length + 4}"></td>
    </tr>`;
    
    // Predicted row
    html += `<tr class="extra-row">
        <th>Predicted</th>
        ${labels.map((l, i) => `<td data-predicted="${i}">?</td>`).join('')}
        <td class="separator"></td>
        <td data-support-weighted>?</td>
        <td data-recall-macro>?</td>
    </tr>`;
    
    // Precision row
    html += `<tr class="extra-row">
        <th>Precision</th>
        ${labels.map((l, i) => `<td data-precision="${i}">?</td>`).join('')}
        <td class="separator"></td>
        <td data-precision-weighted>?</td>
        <td data-precision-macro>?</td>
    </tr>`;
    
    // Accuracy row (merged cell)
    html += `<tr class="extra-row">
        <th></th>
        ${labels.map(() => '<td></td>').join('')}
        <td class="separator"></td>
        <td colspan="2" data-accuracy style="font-size: 1.2rem; font-weight: bold;">?</td>
    </tr>`;
    
    html += `</tbody></table>`;
    return html;
}

function clearHighlights(methodId) {
    document.querySelectorAll(`#walkthrough-${methodId} .wt-cm-table td`).forEach(cell => {
        cell.classList.remove('highlight-diagonal', 'fade',
            'highlight-row-0', 'highlight-row-1', 'highlight-row-2', 'highlight-row-3', 'highlight-row-4',
            'highlight-column-0', 'highlight-column-1', 'highlight-column-2', 'highlight-column-3', 'highlight-column-4');
    });
}

function highlightCell(methodId, row, col, type, index = null) {
    const cell = document.querySelector(`#walkthrough-${methodId} .wt-cm-table td[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        const className = index !== null ? `highlight-${type}-${index}` : `highlight-${type}`;
        cell.classList.add(className);
    }
}

function fillExtraCell(methodId, attr, value, isPercentage = false) {
    const cell = document.querySelector(`#walkthrough-${methodId} [data-${attr}]`);
    if (cell) {
        const displayValue = isPercentage ? (value * 100).toFixed(1) + '%' : value;
        cell.textContent = displayValue;
        cell.classList.add('filled');
    }
}

function clearExtraCells(methodId) {
    document.querySelectorAll(`#walkthrough-${methodId} [data-support], #walkthrough-${methodId} [data-recall], #walkthrough-${methodId} [data-predicted], #walkthrough-${methodId} [data-precision], #walkthrough-${methodId} [data-recall-macro], #walkthrough-${methodId} [data-support-weighted], #walkthrough-${methodId} [data-precision-macro], #walkthrough-${methodId} [data-precision-weighted], #walkthrough-${methodId} [data-accuracy]`).forEach(cell => {
        cell.textContent = '?';
        cell.classList.remove('filled');
    });
}

