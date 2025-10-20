"""
Segmentation EDA - Quality Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_segmentation.html

Analyzes mask annotation quality, consistency, and coverage metrics.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("✅ SEGMENTATION EDA - Quality Analysis (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading quality metrics from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/segmentation/quality_metrics.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded metrics for {len(df)} breeds")
print(f"   ✓ Columns: {list(df.columns)}")

# ============================================================================
# 2. CHART 1: Average Coverage by Breed
# ============================================================================
print("\n2️⃣ Creating Average Coverage Chart...")

# Sort by coverage
df_sorted = df.sort_values('avg_coverage', ascending=True)

# Top 15 and bottom 15 for visualization
top_n = 15
df_plot = pd.concat([df_sorted.head(top_n), df_sorted.tail(top_n)])

fig1 = go.Figure(data=[go.Bar(
    x=df_plot['avg_coverage'],
    y=[breed.replace('_', ' ').title() for breed in df_plot['breed']],
    orientation='h',
    marker_color='#10b981',  # Green - matching web report
    hovertemplate='<b>%{y}</b><br>Coverage: %{x:.1%}<extra></extra>'
)])

fig1.update_layout(
    title=f"Average Mask Coverage by Breed (Top & Bottom {top_n})",
    xaxis=dict(title="Average Coverage (% of image)", tickformat='.0%'),
    yaxis=dict(title="Breed"),
    template="plotly_white",
    height=600,
    showlegend=False
)

print("   ✓ Coverage chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: Coverage Consistency (CV)
# ============================================================================
print("\n3️⃣ Creating Coverage Consistency Chart...")

# Coefficient of Variation for coverage (lower = more consistent)
df_consistency = df.sort_values('coverage_cv', ascending=True)

fig2 = go.Figure(data=[go.Bar(
    x=[breed.replace('_', ' ').title() for breed in df_consistency['breed']],
    y=df_consistency['coverage_cv'],
    marker_color='#3b82f6',  # Blue - matching web report
    hovertemplate='<b>%{x}</b><br>Coverage CV: %{y:.3f}<extra></extra>'
)])

fig2.update_layout(
    title="Mask Coverage Consistency (Coefficient of Variation)",
    xaxis=dict(title="Breed", tickangle=-45, showticklabels=False),  # Too many to show
    yaxis=dict(title="Coefficient of Variation (lower = more consistent)"),
    template="plotly_white",
    height=400,
    showlegend=False,
    annotations=[dict(
        text="Lower values indicate more consistent mask sizes within a breed",
        xref="paper",
        yref="paper",
        x=0.5,
        y=-0.15,
        showarrow=False,
        font=dict(size=10, color="gray")
    )]
)

print("   ✓ Consistency chart created")
fig2.show()

# ============================================================================
# 4. CHART 3: Pixel Class Distribution by Breed (Top 20)
# ============================================================================
print("\n4️⃣ Creating Pixel Class Distribution by Breed...")

# Select top 20 breeds by count
df_top = df.nlargest(20, 'count')

# Trimap colors - EXACT matching web report
trimap_colors = {
    'Foreground': '#ef4444',   # Red
    'Boundary': '#f59e0b',     # Orange
    'Background': '#3b82f6'    # Blue
}

fig3 = go.Figure()

fig3.add_trace(go.Bar(
    name='Foreground',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['avg_fg_pct'],
    marker_color=trimap_colors['Foreground'],
    hovertemplate='<b>%{x}</b><br>Foreground: %{y:.1f}%<extra></extra>'
))

fig3.add_trace(go.Bar(
    name='Boundary',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['avg_boundary_pct'],
    marker_color=trimap_colors['Boundary'],
    hovertemplate='<b>%{x}</b><br>Boundary: %{y:.1f}%<extra></extra>'
))

fig3.add_trace(go.Bar(
    name='Background',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['avg_bg_pct'],
    marker_color=trimap_colors['Background'],
    hovertemplate='<b>%{x}</b><br>Background: %{y:.1f}%<extra></extra>'
))

fig3.update_layout(
    title="Pixel Class Distribution by Breed (Top 20)",
    xaxis=dict(title="Breed", tickangle=-45),
    yaxis=dict(title="Percentage (%)"),
    barmode='stack',
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Pixel distribution chart created")
fig3.show()

# ============================================================================
# 5. CHART 4: Foreground Consistency Analysis
# ============================================================================
print("\n5️⃣ Creating Foreground Consistency Analysis...")

fig4 = go.Figure(data=[go.Bar(
    x=[breed.replace('_', ' ').title() for breed in df_consistency['breed']],
    y=df['fg_cv'],
    marker_color='#ef4444',  # Red - matching foreground color
    hovertemplate='<b>%{x}</b><br>FG CV: %{y:.3f}<extra></extra>'
)])

fig4.update_layout(
    title="Foreground Percentage Consistency (CV by Breed)",
    xaxis=dict(title="Breed", tickangle=-45, showticklabels=False),
    yaxis=dict(title="Foreground CV (lower = more consistent)"),
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Foreground consistency chart created")
fig4.show()

# ============================================================================
# 6. CHART 5: Quality Scatter (Coverage vs FG Consistency)
# ============================================================================
print("\n6️⃣ Creating Quality Metrics Scatter Plot...")

# Create quality categories
def categorize_quality(row):
    if row['avg_coverage'] > df['avg_coverage'].median() and row['fg_cv'] < df['fg_cv'].median():
        return 'High Quality'
    elif row['avg_coverage'] < df['avg_coverage'].median() and row['fg_cv'] > df['fg_cv'].median():
        return 'Low Quality'
    else:
        return 'Medium Quality'

df['quality_category'] = df.apply(categorize_quality, axis=1)

quality_colors = {
    'High Quality': '#10b981',    # Green
    'Medium Quality': '#f59e0b',  # Orange
    'Low Quality': '#ef4444'      # Red
}

fig5 = go.Figure()

for quality_cat in ['High Quality', 'Medium Quality', 'Low Quality']:
    subset = df[df['quality_category'] == quality_cat]
    fig5.add_trace(go.Scatter(
        x=subset['avg_coverage'],
        y=subset['fg_cv'],
        mode='markers',
        name=quality_cat,
        marker=dict(
            size=10,
            color=quality_colors[quality_cat],
            opacity=0.7,
            line=dict(width=1, color='white')
        ),
        text=[breed.replace('_', ' ').title() for breed in subset['breed']],
        hovertemplate='<b>%{text}</b><br>Coverage: %{x:.1%}<br>FG CV: %{y:.3f}<extra></extra>'
    ))

fig5.update_layout(
    title="Annotation Quality: Coverage vs Foreground Consistency",
    xaxis=dict(title="Average Coverage (% of image)", tickformat='.0%'),
    yaxis=dict(title="Foreground CV (lower = more consistent)"),
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Quality scatter plot created")
fig5.show()

# ============================================================================
# 7. STATISTICS SUMMARY
# ============================================================================
print("\n7️⃣ Statistics Summary:")
print("="*70)

print(f"✅ Overall Quality Metrics:")
print(f"   Coverage:")
print(f"      • Mean: {df['avg_coverage'].mean():.1%} of image")
print(f"      • Median: {df['avg_coverage'].median():.1%}")
print(f"      • Range: {df['avg_coverage'].min():.1%} - {df['avg_coverage'].max():.1%}")

print(f"\n   Consistency (Coverage CV):")
print(f"      • Mean: {df['coverage_cv'].mean():.3f}")
print(f"      • Median: {df['coverage_cv'].median():.3f}")
print(f"      • Range: {df['coverage_cv'].min():.3f} - {df['coverage_cv'].max():.3f}")

print(f"\n   Foreground Consistency (FG CV):")
print(f"      • Mean: {df['fg_cv'].mean():.3f}")
print(f"      • Median: {df['fg_cv'].median():.3f}")
print(f"      • Range: {df['fg_cv'].min():.3f} - {df['fg_cv'].max():.3f}")

print(f"\n📊 Pixel Class Averages (Overall):")
print(f"      • Foreground: {df['avg_fg_pct'].mean():.1f}%")
print(f"      • Boundary: {df['avg_boundary_pct'].mean():.1f}%")
print(f"      • Background: {df['avg_bg_pct'].mean():.1f}%")

print(f"\n🏆 Top 5 Breeds by Coverage:")
top_coverage = df.nlargest(5, 'avg_coverage')
for idx, row in top_coverage.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['avg_coverage']:.1%}")

print(f"\n⚠️ Bottom 5 Breeds by Coverage:")
bottom_coverage = df.nsmallest(5, 'avg_coverage')
for idx, row in bottom_coverage.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['avg_coverage']:.1%}")

print(f"\n🎯 Most Consistent Breeds (Lowest FG CV):")
most_consistent = df.nsmallest(5, 'fg_cv')
for idx, row in most_consistent.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: CV = {row['fg_cv']:.3f}")

print(f"\n📏 Least Consistent Breeds (Highest FG CV):")
least_consistent = df.nlargest(5, 'fg_cv')
for idx, row in least_consistent.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: CV = {row['fg_cv']:.3f}")

print(f"\n✨ Quality Categories:")
quality_counts = df['quality_category'].value_counts()
for cat, count in quality_counts.items():
    percentage = (count / len(df)) * 100
    print(f"      • {cat}: {count} breeds ({percentage:.1f}%)")

print(f"\n💡 Quality Interpretation:")
print(f"   • High Quality: Good coverage + consistent foreground")
print(f"   • Medium Quality: Either good coverage OR consistency")
print(f"   • Low Quality: Poor coverage AND inconsistent foreground")

print("="*70)
print("✅ Quality analysis complete! Charts match web report.")

