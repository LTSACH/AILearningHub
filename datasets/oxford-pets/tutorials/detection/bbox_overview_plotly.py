"""
Oxford Pets Bounding Box Overview - Plotly Version

Tutorial: Detection Overview
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze bounding box annotations for pet head detection.
    Visualize bbox statistics, distribution across breeds and species.

Requirements:
    pip install pandas plotly numpy

Data Source:
    Pre-computed bbox statistics (3,671 annotations from train+val splits):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv

Note:
    Oxford Pets test split doesn't have annotations (evaluation only).
    This tutorial uses train+val splits (3,671 bboxes).
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

# ============================================================================
# Load Pre-computed Data
# ============================================================================

print("📦 Loading Bounding Box Statistics...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'

print("\n⏳ Loading bbox statistics...")
df = pd.read_csv(base_url + 'bbox_statistics.csv')
print(f"✓ Loaded {len(df):,} bounding boxes")
print(f"✓ Splits: {df['split'].value_counts().to_dict()}")
print(f"✓ Breeds: {df['breed'].nunique()}")
print(f"✓ Species: {df['species'].nunique()}")

# ============================================================================
# Visualization 1: Overview Statistics
# ============================================================================

print("\n📊 Creating overview statistics...")

# Summary stats
total_bboxes = len(df)
avg_boxes_per_image = 1.0  # Oxford Pets: 1 bbox per image
species_counts = df['species'].value_counts()

# Create bar chart for species distribution
fig_species = go.Figure(data=[
    go.Bar(
        x=species_counts.index,
        y=species_counts.values,
        marker=dict(color=['#3b82f6', '#f59e0b']),
        text=species_counts.values,
        textposition='auto'
    )
])

fig_species.update_layout(
    title='Bounding Boxes by Species',
    xaxis_title='Species',
    yaxis_title='Count',
    template='plotly_white',
    height=400,
    showlegend=False
)

fig_species.show()

# ============================================================================
# Visualization 2: Split Distribution
# ============================================================================

print("\n📈 Creating split distribution...")

split_counts = df['split'].value_counts()

fig_split = go.Figure(data=[
    go.Pie(
        labels=split_counts.index,
        values=split_counts.values,
        hole=0.3,
        marker=dict(colors=['#10b981', '#3b82f6']),
        textinfo='label+value+percent'
    )
])

fig_split.update_layout(
    title='Train/Val Split Distribution',
    template='plotly_white',
    height=400
)

fig_split.show()

# ============================================================================
# Visualization 3: Boxes per Breed (Top 20)
# ============================================================================

print("\n📊 Creating breed distribution...")

breed_counts = df['breed'].value_counts().head(20)

fig_breeds = go.Figure(data=[
    go.Bar(
        x=breed_counts.values,
        y=breed_counts.index,
        orientation='h',
        marker=dict(
            color=breed_counts.values,
            colorscale='Viridis',
            showscale=True,
            colorbar=dict(title="Count")
        ),
        text=breed_counts.values,
        textposition='auto'
    )
])

fig_breeds.update_layout(
    title='Top 20 Breeds by Bbox Count',
    xaxis_title='Number of Bounding Boxes',
    yaxis_title='Breed',
    template='plotly_white',
    height=600,
    showlegend=False
)

fig_breeds.show()

# ============================================================================
# Summary Statistics
# ============================================================================

print("\n" + "=" * 70)
print("📊 SUMMARY STATISTICS")
print("=" * 70)
print(f"\n📦 Total Bounding Boxes: {total_bboxes:,}")
print(f"📊 Breeds: {df['breed'].nunique()}")
print(f"🐕 Dogs: {species_counts.get('dog', 0):,}")
print(f"🐈 Cats: {species_counts.get('cat', 0):,}")
print(f"📂 Train: {split_counts.get('train', 0):,}")
print(f"📂 Val: {split_counts.get('val', 0):,}")
print(f"\n💡 Note: Test split has no annotations (evaluation only)")
print("=" * 70)

