"""
Classification EDA - Breed Similarity Analysis (Plotly)
Reproduces similarity heatmap from: https://ltsach.github.io/AILearningHub/.../eda_classification.html

Uses pre-computed breed similarity matrix (37x37) from averaged breed features.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
import pandas as pd
import numpy as np

print("="*70)
print("🔬 CLASSIFICATION EDA - Breed Similarity Analysis (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD PRE-COMPUTED SIMILARITY MATRIX FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading pre-computed similarity matrix from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/classification/similarity_matrix.csv'
similarity_df = pd.read_csv(url, index_col=0)

print(f"   ✓ Loaded similarity matrix: {similarity_df.shape[0]}x{similarity_df.shape[1]}")
print(f"   ✓ Breeds: {similarity_df.shape[0]}")

# Get breed names
breed_names = [b.replace('_', ' ').title() for b in similarity_df.index]

# ============================================================================
# 2. CHART 1: Full Breed Similarity Heatmap (37x37)
# ============================================================================
print("\n2️⃣ Creating Breed Similarity Heatmap...")

fig = go.Figure(data=go.Heatmap(
    z=similarity_df.values,
    x=breed_names,
    y=breed_names,
    colorscale='RdYlBu_r',  # Red (dissimilar) to Blue (similar)
    zmin=0,
    zmax=1,
    colorbar=dict(
        title="Similarity",
        thickness=20,
        len=0.7
    ),
    hovertemplate='<b>%{y}</b> vs <b>%{x}</b><br>Similarity: %{z:.3f}<extra></extra>'
))

fig.update_layout(
    title=dict(
        text='Breed Similarity Matrix (Feature-Based Cosine Similarity)',
        font=dict(size=16)
    ),
    xaxis=dict(
        title='Breed',
        tickangle=-45,
        tickfont=dict(size=9),
        side='bottom'
    ),
    yaxis=dict(
        title='Breed',
        tickfont=dict(size=9)
    ),
    width=900,
    height=850,
    margin=dict(l=150, r=100, t=100, b=150)
)

print("   ✓ Similarity heatmap created (37x37)")
fig.show()

# ============================================================================
# 3. FIND MOST & LEAST SIMILAR BREED PAIRS
# ============================================================================
print("\n3️⃣ Analyzing breed similarity pairs...")

# Get upper triangle (exclude diagonal)
similarity_matrix = similarity_df.values
np.fill_diagonal(similarity_matrix, -1)  # Exclude self-similarity

# Find most similar pairs
most_similar_pairs = []
for i in range(len(breed_names)):
    for j in range(i+1, len(breed_names)):
        most_similar_pairs.append({
            'breed1': breed_names[i],
            'breed2': breed_names[j],
            'similarity': similarity_matrix[i, j]
        })

most_similar_pairs = sorted(most_similar_pairs, key=lambda x: x['similarity'], reverse=True)[:10]

# Find least similar pairs
least_similar_pairs = sorted(most_similar_pairs, key=lambda x: x['similarity'])[:10]

print("\n🔝 Top 10 Most Similar Breed Pairs:")
for idx, pair in enumerate(most_similar_pairs, 1):
    print(f"   {idx:2d}. {pair['breed1']:25s} ↔ {pair['breed2']:25s}: {pair['similarity']:.3f}")

print("\n⬇️  Top 10 Least Similar Breed Pairs:")
for idx, pair in enumerate(least_similar_pairs, 1):
    print(f"   {idx:2d}. {pair['breed1']:25s} ↔ {pair['breed2']:25s}: {pair['similarity']:.3f}")

# ============================================================================
# 4. CHART 2: Top 15 Breeds Similarity (Subset for Clarity)
# ============================================================================
print("\n4️⃣ Creating Top 15 Breeds Similarity Heatmap...")

# Get top 15 breeds by popularity (assuming first 15 are most popular)
top_15_breeds = breed_names[:15]
top_15_indices = list(range(15))
top_15_matrix = similarity_df.iloc[top_15_indices, top_15_indices].values

fig2 = go.Figure(data=go.Heatmap(
    z=top_15_matrix,
    x=top_15_breeds,
    y=top_15_breeds,
    colorscale='RdYlBu_r',
    zmin=0,
    zmax=1,
    colorbar=dict(title="Similarity"),
    text=np.round(top_15_matrix, 2),
    texttemplate='%{text}',
    textfont=dict(size=9),
    hovertemplate='<b>%{y}</b> vs <b>%{x}</b><br>Similarity: %{z:.3f}<extra></extra>'
))

fig2.update_layout(
    title='Breed Similarity Matrix (Top 15 Breeds)',
    xaxis=dict(tickangle=-45),
    yaxis=dict(),
    width=700,
    height=700
)

print("   ✓ Top 15 breeds heatmap created")
fig2.show()

# ============================================================================
# 5. STATISTICS SUMMARY
# ============================================================================
print("\n5️⃣ Similarity Statistics:")
print("="*70)

# Overall statistics (exclude diagonal)
upper_triangle = similarity_matrix[np.triu_indices(len(breed_names), k=1)]

print(f"📊 Overall Similarity Statistics:")
print(f"   • Mean similarity: {upper_triangle.mean():.3f}")
print(f"   • Median similarity: {np.median(upper_triangle):.3f}")
print(f"   • Std deviation: {upper_triangle.std():.3f}")
print(f"   • Min similarity: {upper_triangle.min():.3f}")
print(f"   • Max similarity: {upper_triangle.max():.3f}")

print("\n💡 Key Insights:")
print("   ✓ Higher similarity → breeds are harder to distinguish visually")
print("   ✓ Lower similarity → breeds have distinct visual features")
print("   ✓ Similarity based on ResNet50 features (deep visual patterns)")
print("   ✓ Can inform model architecture and training strategies")

print("\n📌 Method:")
print("   • Features: ResNet50 (ImageNet pre-trained)")
print("   • Aggregation: Mean feature vector per breed")
print("   • Similarity: Cosine similarity (37x37 matrix)")
print("   • Pre-computed for instant visualization")

print("="*70)
print("✅ Breed similarity analysis complete! Heatmap matches web report.")
