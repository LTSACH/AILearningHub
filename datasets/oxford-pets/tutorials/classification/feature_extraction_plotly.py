"""
Oxford Pets Feature Extraction & Visualization - Plotly Version

Tutorial: Feature Extraction
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Visualize deep features extracted using ResNet50 with t-SNE and UMAP
    dimensionality reduction. Creates publication-quality 2D projections
    with proper color coding for all 37 breeds.

Requirements:
    pip install pandas plotly numpy

Data Source:
    Pre-computed t-SNE coordinates:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/tsne_coordinates.csv
    
    Pre-computed UMAP coordinates:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/umap_coordinates.csv

Note:
    This tutorial uses pre-computed features for instant visualization.
    Features were extracted using ResNet50 (ImageNet pretrained).
    Code matches the web report charts exactly.
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go

# ============================================================================
# Load Pre-computed Data
# ============================================================================

print("📊 Loading Pre-computed Feature Visualizations...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'

print("\n⏳ Loading t-SNE coordinates...")
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')
print(f"✓ Loaded t-SNE data: {len(tsne_df):,} samples")

print("\n⏳ Loading UMAP coordinates...")
umap_df = pd.read_csv(base_url + 'umap_coordinates.csv')
print(f"✓ Loaded UMAP data: {len(umap_df):,} samples")

print(f"\n✓ Breeds: {tsne_df['breed'].nunique()}")
print(f"✓ Species: {tsne_df['species'].nunique()}")

# ============================================================================
# Helper Function: Generate Color Palette for 37 Breeds
# ============================================================================

def generate_color_palette(n_colors):
    """Generate distinct colors for breeds (matches web report)"""
    import colorsys
    colors = []
    for i in range(n_colors):
        hue = i / n_colors
        saturation = 0.7 + (i % 3) * 0.1
        value = 0.8 + (i % 2) * 0.1
        rgb = colorsys.hsv_to_rgb(hue, saturation, value)
        colors.append(f'rgb({int(rgb[0]*255)},{int(rgb[1]*255)},{int(rgb[2]*255)})')
    return colors

# ============================================================================
# Visualization 1: t-SNE 2D Projection (Matches Web Report)
# ============================================================================

print("\n📈 Creating t-SNE visualization (37 breeds, distinct colors)...")

# Get unique breeds (sorted for consistency) - filter out NaN
breed_names = sorted([b for b in tsne_df['breed'].unique() if pd.notna(b)])
colors = generate_color_palette(len(breed_names))
breed_to_color = {breed: colors[i] for i, breed in enumerate(breed_names)}

# Create one trace per breed (for distinct colors and legend)
traces_tsne = []
for breed in breed_names:
    breed_data = tsne_df[tsne_df['breed'] == breed]
    
    trace = go.Scatter(
        x=breed_data['tsne_x'],
        y=breed_data['tsne_y'],
        mode='markers',
        name=breed,
        marker=dict(
            size=8,
            color=breed_to_color[breed],
            line=dict(width=0.5, color='white')
        ),
        text=[breed] * len(breed_data),
        hovertemplate='<b>%{text}</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<extra></extra>'
    )
    traces_tsne.append(trace)

# Create figure
fig_tsne = go.Figure(data=traces_tsne)

fig_tsne.update_layout(
    title={
        'text': 't-SNE 2D Projection of Pet Breeds (ResNet50 Features)',
        'font': {'size': 18}
    },
    xaxis_title='t-SNE Dimension 1',
    yaxis_title='t-SNE Dimension 2',
    width=800,  # Match web report card width
    height=500,  # Match web report height exactly
    template='plotly_white',
    hovermode='closest',
    legend=dict(
        orientation='v',
        yanchor='top',
        y=1,
        xanchor='left',
        x=1.02,
        font={'size': 10}
    ),
    margin={'r': 200}  # Space for legend
)

print("✓ t-SNE plot created with 37 distinct breed colors")
fig_tsne.show()

# ============================================================================
# Visualization 2: UMAP 2D Projection (Matches Web Report)
# ============================================================================

print("\n📈 Creating UMAP visualization (37 breeds, distinct colors)...")

# Create one trace per breed
traces_umap = []
for breed in breed_names:
    breed_data = umap_df[umap_df['breed'] == breed]
    
    trace = go.Scatter(
        x=breed_data['umap_x'],
        y=breed_data['umap_y'],
        mode='markers',
        name=breed,
        marker=dict(
            size=8,
            color=breed_to_color[breed],
            line=dict(width=0.5, color='white')
        ),
        text=[breed] * len(breed_data),
        hovertemplate='<b>%{text}</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<extra></extra>'
    )
    traces_umap.append(trace)

# Create figure
fig_umap = go.Figure(data=traces_umap)

fig_umap.update_layout(
    title={
        'text': 'UMAP 2D Projection of Pet Breeds (ResNet50 Features)',
        'font': {'size': 18}
    },
    xaxis_title='UMAP Dimension 1',
    yaxis_title='UMAP Dimension 2',
    width=800,  # Match web report card width
    height=500,  # Match web report height exactly
    template='plotly_white',
    hovermode='closest',
    legend=dict(
        orientation='v',
        yanchor='top',
        y=1,
        xanchor='left',
        x=1.02,
        font={'size': 10}
    ),
    margin={'r': 200}
)

print("✓ UMAP plot created with 37 distinct breed colors")
fig_umap.show()

# ============================================================================
# Visualization 3: Species-Level View (Simplified)
# ============================================================================

print("\n📈 Creating species-level t-SNE view (simplified)...")

# Simple 2-color version (cats vs dogs)
fig_species = go.Figure()

for species, color in [('cat', '#667eea'), ('dog', '#f093fb')]:
    species_data = tsne_df[tsne_df['species'] == species]
    
    fig_species.add_trace(go.Scatter(
        x=species_data['tsne_x'],
        y=species_data['tsne_y'],
        mode='markers',
        name=species.capitalize(),
        marker=dict(
            size=8,
            color=color,
            opacity=0.6,
            line=dict(width=1, color='white')
        ),
        text=species_data['breed'],
        hovertemplate='<b>%{text}</b><br>Species: ' + species + '<extra></extra>'
    ))

fig_species.update_layout(
    title='t-SNE: Species Separation (Cats vs Dogs)',
    xaxis_title='t-SNE Dimension 1',
    yaxis_title='t-SNE Dimension 2',
    width=900,
    height=600,
    template='plotly_white',
    legend=dict(title='Species', font=dict(size=14))
)

print("✓ Species-level view created")
fig_species.show()

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ VISUALIZATION COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print("   - Breeds form distinct clusters in feature space")
print("   - Clear separation between cats and dogs")
print("   - Some breed clusters overlap (visually similar breeds)")
print("   - Both t-SNE and UMAP reveal similar structure")
print("\n📊 Technical Details:")
print(f"   - Samples visualized: {len(tsne_df):,}")
print(f"   - Breeds: {tsne_df['breed'].nunique()}")
print(f"   - Feature extractor: ResNet50 (ImageNet pretrained)")
print(f"   - t-SNE parameters: perplexity=30, n_iter=1000")
print(f"   - UMAP parameters: n_neighbors=15, min_dist=0.1")
print("\n📚 Next Steps:")
print("   - Analyze breed similarity using cosine distance")
print("   - Identify most/least similar breed pairs")
print("   - Understand classification challenges")
print("\n💡 Pro Tip:")
print("   - Overlapping clusters = harder to classify")
print("   - Well-separated clusters = easier to classify")
print("   - Use these visualizations to guide model architecture choices")
