# Results Directory

This directory contains generated EDA reports.

## Structure

```
results/
├── index.html                   # Landing page
├── eda_core.html                # Core analysis report
├── eda_classification.html      # Classification report
├── eda_detection.html           # Detection report
├── eda_segmentation.html        # Segmentation report
├── assets/                      # Static assets (CSS, JS)
│   ├── css/
│   ├── js/
│   └── data/                    # Embedded data (JSON)
└── sample_outputs/              # Sample screenshots (for GitHub)
```

## Viewing Reports

Open HTML files in your browser:

```bash
# macOS
open results/index.html

# Linux
xdg-open results/index.html

# Windows
start results/index.html
```

## Regenerating Reports

```bash
# Run all EDAs
./run_eda.sh --task all

# Or run specific task
./run_eda.sh --task classification
```

