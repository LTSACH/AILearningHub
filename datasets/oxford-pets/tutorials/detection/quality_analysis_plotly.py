"""
Detection EDA - Quality Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_detection.html

Analyzes annotation quality metrics, consistency, coverage with exact colors.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("✅ DETECTION EDA - Quality Analysis (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading quality metrics from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/detection/quality_metrics.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded metrics for {len(df)} breeds")
print(f"   ✓ Columns: {list(df.columns)}")

# ============================================================================
# 2. CHART 1: Average Coverage by Breed
# ============================================================================
print("\n2️⃣ Creating Average Coverage Chart...")

# Sort by coverage for better visualization
df_sorted = df.sort_values('avg_coverage', ascending=True)

# Top 15 and bottom 15 for clarity
top_n = 15
df_plot = pd.concat([df_sorted.head(top_n), df_sorted.tail(top_n)])

fig1 = go.Figure(data=[go.Bar(
    x=df_plot['avg_coverage'],
    y=[breed.replace('_', ' ').title() for breed in df_plot['breed']],
    orientation='h',
    marker_color='#3b82f6',  # Blue - matching web report
    hovertemplate='<b>%{y}</b><br>Coverage: %{x:.1%}<extra></extra>'
)])

fig1.update_layout(
    title=f"Average Bbox Coverage by Breed (Top & Bottom {top_n})",
    xaxis=dict(title="Average Coverage (% of image)", tickformat='.0%'),
    yaxis=dict(title="Breed"),
    template="plotly_white",
    height=600,
    showlegend=False
)

print("   ✓ Coverage chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: Annotation Consistency (Area CV)
# ============================================================================
print("\n3️⃣ Creating Annotation Consistency Chart...")

# Coefficient of Variation for area (lower = more consistent)
df_consistency = df.sort_values('area_cv', ascending=True)

fig2 = go.Figure(data=[go.Bar(
    x=[breed.replace('_', ' ').title() for breed in df_consistency['breed']],
    y=df_consistency['area_cv'],
    marker_color='#10b981',  # Green - matching web report
    hovertemplate='<b>%{x}</b><br>Area CV: %{y:.2f}<extra></extra>'
)])

fig2.update_layout(
    title="Annotation Consistency (Area Coefficient of Variation)",
    xaxis=dict(title="Breed", tickangle=-45, showticklabels=False),  # Too many to show
    yaxis=dict(title="Coefficient of Variation (lower = more consistent)"),
    template="plotly_white",
    height=400,
    showlegend=False,
    annotations=[dict(
        text="Lower values indicate more consistent bbox sizes within a breed",
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
# 4. CHART 3: Size Distribution by Breed (Small/Medium/Large %)
# ============================================================================
print("\n4️⃣ Creating Size Distribution by Breed...")

# Select top 20 breeds by count for visualization
df_top = df.nlargest(20, 'count')

fig3 = go.Figure()

fig3.add_trace(go.Bar(
    name='Small',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['pct_small'] * 100,
    marker_color='#f59e0b',  # Orange - matching web report
    hovertemplate='<b>%{x}</b><br>Small: %{y:.1f}%<extra></extra>'
))

fig3.add_trace(go.Bar(
    name='Medium',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['pct_medium'] * 100,
    marker_color='#10b981',  # Green - matching web report
    hovertemplate='<b>%{x}</b><br>Medium: %{y:.1f}%<extra></extra>'
))

fig3.add_trace(go.Bar(
    name='Large',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['pct_large'] * 100,
    marker_color='#3b82f6',  # Blue - matching web report
    hovertemplate='<b>%{x}</b><br>Large: %{y:.1f}%<extra></extra>'
))

fig3.update_layout(
    title="Size Category Distribution by Breed (Top 20)",
    xaxis=dict(title="Breed", tickangle=-45),
    yaxis=dict(title="Percentage (%)"),
    barmode='stack',
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Size distribution chart created")
fig3.show()

# ============================================================================
# 5. CHART 4: Quality Metrics Scatter (Coverage vs Consistency)
# ============================================================================
print("\n5️⃣ Creating Quality Metrics Scatter Plot...")

# Create quality categories based on coverage and consistency
def categorize_quality(row):
    if row['avg_coverage'] > df['avg_coverage'].median() and row['area_cv'] < df['area_cv'].median():
        return 'High Quality'
    elif row['avg_coverage'] < df['avg_coverage'].median() and row['area_cv'] > df['area_cv'].median():
        return 'Low Quality'
    else:
        return 'Medium Quality'

df['quality_category'] = df.apply(categorize_quality, axis=1)

quality_colors = {
    'High Quality': '#10b981',    # Green
    'Medium Quality': '#f59e0b',  # Orange
    'Low Quality': '#ef4444'      # Red
}

fig4 = go.Figure()

for quality_cat in ['High Quality', 'Medium Quality', 'Low Quality']:
    subset = df[df['quality_category'] == quality_cat]
    fig4.add_trace(go.Scatter(
        x=subset['avg_coverage'],
        y=subset['area_cv'],
        mode='markers',
        name=quality_cat,
        marker=dict(
            size=10,
            color=quality_colors[quality_cat],
            opacity=0.7,
            line=dict(width=1, color='white')
        ),
        text=[breed.replace('_', ' ').title() for breed in subset['breed']],
        hovertemplate='<b>%{text}</b><br>Coverage: %{x:.1%}<br>Area CV: %{y:.2f}<extra></extra>'
    ))

fig4.update_layout(
    title="Annotation Quality: Coverage vs Consistency",
    xaxis=dict(title="Average Coverage (% of image)", tickformat='.0%'),
    yaxis=dict(title="Area CV (lower = more consistent)"),
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Quality scatter plot created")
fig4.show()

# ============================================================================
# 6. STATISTICS SUMMARY
# ============================================================================
print("\n6️⃣ Statistics Summary:")
print("="*70)

print(f"✅ Overall Quality Metrics:")
print(f"   Coverage:")
print(f"      • Mean: {df['avg_coverage'].mean():.1%} of image")
print(f"      • Median: {df['avg_coverage'].median():.1%}")
print(f"      • Range: {df['avg_coverage'].min():.1%} - {df['avg_coverage'].max():.1%}")

print(f"\n   Consistency (Area CV):")
print(f"      • Mean: {df['area_cv'].mean():.2f}")
print(f"      • Median: {df['area_cv'].median():.2f}")
print(f"      • Range: {df['area_cv'].min():.2f} - {df['area_cv'].max():.2f}")

print(f"\n   Aspect Ratio Consistency:")
print(f"      • Mean CV: {df['aspect_cv'].mean():.2f}")
print(f"      • Median CV: {df['aspect_cv'].median():.2f}")

print(f"\n📊 Size Category Distribution (Overall):")
print(f"      • Small: {df['pct_small'].mean():.1%}")
print(f"      • Medium: {df['pct_medium'].mean():.1%}")
print(f"      • Large: {df['pct_large'].mean():.1%}")

print(f"\n🏆 Top 5 Breeds by Coverage:")
top_coverage = df.nlargest(5, 'avg_coverage')
for idx, row in top_coverage.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['avg_coverage']:.1%}")

print(f"\n⚠️ Bottom 5 Breeds by Coverage:")
bottom_coverage = df.nsmallest(5, 'avg_coverage')
for idx, row in bottom_coverage.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['avg_coverage']:.1%}")

print(f"\n🎯 Most Consistent Breeds (Lowest Area CV):")
most_consistent = df.nsmallest(5, 'area_cv')
for idx, row in most_consistent.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: CV = {row['area_cv']:.2f}")

print(f"\n📏 Least Consistent Breeds (Highest Area CV):")
least_consistent = df.nlargest(5, 'area_cv')
for idx, row in least_consistent.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: CV = {row['area_cv']:.2f}")

print(f"\n✨ Quality Categories:")
quality_counts = df['quality_category'].value_counts()
for cat, count in quality_counts.items():
    percentage = (count / len(df)) * 100
    print(f"      • {cat}: {count} breeds ({percentage:.1f}%)")

print("="*70)
print("✅ Quality analysis complete! Charts match web report.")
