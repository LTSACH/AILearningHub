"""Oxford Pets Pixel Distribution - Plotly
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/pixel_distribution.csv
"""
import pandas as pd
import plotly.graph_objects as go

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'pixel_distribution.csv')

fig = go.Figure(data=[
    go.Bar(x=df['breed'], y=df['fg_percentage_mean'], name='Foreground', marker=dict(color='#ef4444')),
    go.Bar(x=df['breed'], y=df['boundary_percentage_mean'], name='Boundary', marker=dict(color='#f59e0b')),
    go.Bar(x=df['breed'], y=df['bg_percentage_mean'], name='Background', marker=dict(color='#3b82f6'))
])
fig.update_layout(title='Pixel Distribution by Breed', barmode='stack', template='plotly_white', height=500)
fig.show()
