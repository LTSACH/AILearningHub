"""
Oxford Pets Mask Overview - Plotly Version

Tutorial: Segmentation Overview
Library: Plotly
Dataset: Oxford-IIIT Pets

Requirements:
    pip install pandas plotly numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/mask_statistics.csv
"""

import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'mask_statistics.csv')

print(f"✓ Loaded {len(df):,} masks")

# Species distribution
species_counts = df['species'].value_counts()
fig1 = go.Figure(data=[go.Bar(x=species_counts.index, y=species_counts.values, 
                               marker=dict(color=['#3b82f6', '#f59e0b']))])
fig1.update_layout(title='Masks by Species', template='plotly_white', height=400)
fig1.show()

# Split distribution  
split_counts = df['split'].value_counts()
fig2 = go.Figure(data=[go.Pie(labels=split_counts.index, values=split_counts.values, hole=0.3)])
fig2.update_layout(title='Train/Val Split', template='plotly_white', height=400)
fig2.show()

print(f"\nTotal: {len(df):,} masks, {df['breed'].nunique()} breeds")
print(f"Mean FG: {df['fg_percentage'].mean():.1f}%, Boundary: {df['boundary_percentage'].mean():.1f}%")

