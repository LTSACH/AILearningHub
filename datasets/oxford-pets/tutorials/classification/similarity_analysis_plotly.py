"""
Oxford Pets Breed Similarity Analysis - Plotly Version
Analyze breed similarity using pre-computed cosine similarity matrix.
"""
import pandas as pd
import plotly.graph_objects as go
import numpy as np

print("📊 Loading pre-computed similarity matrix...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
similarity_df = pd.read_csv(base_url + 'similarity_matrix.csv', index_col=0)
print(f"✓ Loaded {similarity_df.shape[0]}×{similarity_df.shape[1]} similarity matrix")

# Extract breeds and matrix
breeds = similarity_df.columns.tolist()
similarity_matrix = similarity_df.values

print(f"\n📊 Matrix Statistics:")
print(f"  Mean similarity: {np.mean(similarity_matrix[np.triu_indices_from(similarity_matrix, k=1)]):.4f}")
print(f"  Max similarity:  {np.max(similarity_matrix[np.triu_indices_from(similarity_matrix, k=1)]):.4f}")
print(f"  Min similarity:  {np.min(similarity_matrix[np.triu_indices_from(similarity_matrix, k=1)]):.4f}")

# Create heatmap
fig = go.Figure(data=go.Heatmap(
    z=similarity_matrix,
    x=breeds,
    y=breeds,
    colorscale='RdYlBu_r',
    zmid=0.5,
    text=np.round(similarity_matrix, 3),
    texttemplate='%{text}',
    textfont={"size": 6},
    colorbar=dict(title="Cosine<br>Similarity"),
    hovertemplate='<b>%{y}</b> vs <b>%{x}</b><br>Similarity: %{z:.4f}<extra></extra>'
))

fig.update_layout(
    title={
        'text': 'Breed Similarity Matrix (37×37)<br><sub>Based on ResNet50 Features</sub>',
        'x': 0.5,
        'xanchor': 'center'
    },
    xaxis={'title': 'Breed', 'tickangle': 45, 'tickfont': {'size': 9}},
    yaxis={'title': 'Breed', 'tickfont': {'size': 9}},
    width=1100,
    height=1000,
    template='plotly_white'
)

print("\n📈 Displaying similarity heatmap...")
fig.show()

# Find most similar pairs
print("\n" + "="*70)
print("TOP 10 MOST SIMILAR BREED PAIRS")
print("="*70)

similarities = []
for i in range(len(breeds)):
    for j in range(i+1, len(breeds)):
        similarities.append((breeds[i], breeds[j], similarity_matrix[i, j]))

similarities.sort(key=lambda x: x[2], reverse=True)

for i, (breed1, breed2, sim) in enumerate(similarities[:10], 1):
    print(f"{i:2d}. {breed1:30s} ↔ {breed2:30s} : {sim:.4f}")

print("\n✅ Analysis complete!")
print("💡 High similarity (>0.8) = breeds are visually similar → harder to classify")
