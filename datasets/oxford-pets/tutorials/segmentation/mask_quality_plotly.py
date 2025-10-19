"""Oxford Pets Mask Quality - Plotly
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/quality_metrics.csv
"""
import pandas as pd
import plotly.graph_objects as go

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
quality_df = pd.read_csv(base_url + 'quality_metrics.csv')

top_breeds = quality_df.nlargest(15, 'count')
fig = go.Figure(data=[
    go.Bar(x=top_breeds['breed'], y=top_breeds['coverage_cv'], marker=dict(color='#10b981'))
])
fig.update_layout(title='Coverage Consistency (Top 15 Breeds)', template='plotly_white', height=500, xaxis_tickangle=-45)
fig.show()
print(f"Mean coverage CV: {quality_df['coverage_cv'].mean():.3f}")
