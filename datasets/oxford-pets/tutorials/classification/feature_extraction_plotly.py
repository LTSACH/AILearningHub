"""
Classification EDA - Feature Extraction & Visualization (Plotly)
Reproduces t-SNE and UMAP charts from: https://ltsach.github.io/AILearningHub/.../eda_classification.html

Uses pre-computed t-SNE/UMAP coordinates with distinct colors for all 37 breeds.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
import pandas as pd
import colorsys

print("="*70)
print("🔬 CLASSIFICATION EDA - Feature Extraction (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD PRE-COMPUTED FEATURES FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading pre-computed features from GitHub Pages...")

# Load t-SNE coordinates
url_tsne = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/classification/tsne_coordinates.csv'
tsne_df = pd.read_csv(url_tsne)
print(f"   ✓ Loaded t-SNE: {len(tsne_df):,} samples")

# Load UMAP coordinates
url_umap = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/classification/umap_coordinates.csv'
umap_df = pd.read_csv(url_umap)
print(f"   ✓ Loaded UMAP: {len(umap_df):,} samples")

print(f"   ✓ Breeds: {tsne_df['breed'].nunique()}")

# ============================================================================
# 2. GENERATE 37 DISTINCT COLORS (Matching Web Report)
# ============================================================================
print("\n2️⃣ Generating 37 distinct colors for breeds...")

def generate_color_palette(n_colors):
    """Generate n visually distinct colors"""
    colors = []
    for i in range(n_colors):
        hue = i / n_colors
        sat = 0.7 + (i % 3) * 0.1  # Vary saturation
        val = 0.8 + (i % 2) * 0.1  # Vary value
        rgb = colorsys.hsv_to_rgb(hue, sat, val)
        # Convert to hex
        hex_color = '#{:02x}{:02x}{:02x}'.format(
            int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255)
        )
        colors.append(hex_color)
    return colors

# Get unique breeds (sorted for consistency) - filter out NaN
breed_names = sorted([b for b in tsne_df['breed'].unique() if pd.notna(b)])
colors = generate_color_palette(len(breed_names))
breed_to_color = {breed: colors[i] for i, breed in enumerate(breed_names)}

print(f"   ✓ Generated {len(colors)} distinct colors")

# ============================================================================
# 3. CHART 1: t-SNE 2D Projection (37 Breeds, Distinct Colors)
# ============================================================================
print("\n3️⃣ Creating t-SNE visualization...")

fig_tsne = go.Figure()

# Create one trace per breed (for distinct colors and legend)
for breed in breed_names:
    breed_data = tsne_df[tsne_df['breed'] == breed]
    
    fig_tsne.add_trace(go.Scatter(
        x=breed_data['tsne_x'],
        y=breed_data['tsne_y'],
        mode='markers',
        name=breed.replace('_', ' ').title(),
        marker=dict(
            size=8,
            color=breed_to_color[breed],
            line=dict(width=0.5, color='white')
        ),
        text=[breed] * len(breed_data),
        hovertemplate='<b>%{text}</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<extra></extra>'
    ))

fig_tsne.update_layout(
    title=dict(
        text='t-SNE 2D Projection of Pet Breeds (ResNet50 Features)',
        font=dict(size=18)
    ),
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
        font=dict(size=10)
    ),
    margin=dict(r=200)  # Space for legend
)

print("   ✓ t-SNE plot created with 37 distinct breed colors")
fig_tsne.show()

# ============================================================================
# 4. CHART 2: UMAP 2D Projection (37 Breeds, Distinct Colors)
# ============================================================================
print("\n4️⃣ Creating UMAP visualization...")

fig_umap = go.Figure()

# Create one trace per breed
for breed in breed_names:
    breed_data = umap_df[umap_df['breed'] == breed]
    
    fig_umap.add_trace(go.Scatter(
        x=breed_data['umap_x'],
        y=breed_data['umap_y'],
        mode='markers',
        name=breed.replace('_', ' ').title(),
        marker=dict(
            size=8,
            color=breed_to_color[breed],
            line=dict(width=0.5, color='white')
        ),
        text=[breed] * len(breed_data),
        hovertemplate='<b>%{text}</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<extra></extra>'
    ))

fig_umap.update_layout(
    title=dict(
        text='UMAP 2D Projection of Pet Breeds (ResNet50 Features)',
        font=dict(size=18)
    ),
    xaxis_title='UMAP Dimension 1',
    yaxis_title='UMAP Dimension 2',
    width=800,
    height=500,
    template='plotly_white',
    hovermode='closest',
    legend=dict(
        orientation='v',
        yanchor='top',
        y=1,
        xanchor='left',
        x=1.02,
        font=dict(size=10)
    ),
    margin=dict(r=200)
)

print("   ✓ UMAP plot created with 37 distinct breed colors")
fig_umap.show()

# ============================================================================
# 5. ANALYSIS: Breed Clustering & Separability
# ============================================================================
print("\n5️⃣ Breed Clustering Analysis:")
print("="*70)

# Compute cluster statistics (simple center-based)
print("\nt-SNE Statistics:")
for species in ['cat', 'dog']:
    species_df = tsne_df[tsne_df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • X range: [{species_df['tsne_x'].min():.1f}, {species_df['tsne_x'].max():.1f}]")
    print(f"      • Y range: [{species_df['tsne_y'].min():.1f}, {species_df['tsne_y'].max():.1f}]")

print("\nUMAP Statistics:")
for species in ['cat', 'dog']:
    species_df = umap_df[umap_df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • X range: [{species_df['umap_x'].min():.1f}, {species_df['umap_x'].max():.1f}]")
    print(f"      • Y range: [{species_df['umap_y'].min():.1f}, {species_df['umap_y'].max():.1f}]")

# ============================================================================
# 6. KEY INSIGHTS
# ============================================================================
print("\n💡 Key Insights:")
print("   ✓ t-SNE preserves local structure - similar breeds cluster together")
print("   ✓ UMAP preserves both local and global structure - species separation visible")
print("   ✓ Both methods show breed separability in feature space")
print("   ✓ 37 distinct colors used to match web report exactly")

print("\n📌 Notes:")
print("   • Features extracted from ResNet50 (ImageNet pre-trained)")
print("   • Dimensionality reduction: 2048D → 2D")
print("   • Pre-computed for instant visualization")
print("   • Same colors and layout as web report")

print("="*70)
print("✅ Feature extraction analysis complete! Charts match web report.")
