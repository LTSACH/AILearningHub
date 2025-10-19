"""
Core EDA - Size Distribution Analysis (Plotly)
==============================================

This example demonstrates how to create size distribution visualizations
using Plotly for core EDA analysis.
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

def create_size_distribution_plotly(widths, heights, aspect_ratios):
    """
    Create size distribution visualization using Plotly
    
    Args:
        widths (list): Image widths
        heights (list): Image heights  
        aspect_ratios (list): Aspect ratios
        
    Returns:
        plotly.graph_objects.Figure: Plotly figure
    """
    
    # Create subplots
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Width Distribution', 'Height Distribution', 
                       'Aspect Ratio Distribution', 'Size Scatter Plot'),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )
    
    # 1. Width Distribution
    fig.add_trace(
        go.Histogram(x=widths, nbinsx=30, name='Width', 
                    marker_color='lightblue'),
        row=1, col=1
    )
    
    # 2. Height Distribution  
    fig.add_trace(
        go.Histogram(x=heights, nbinsx=30, name='Height',
                    marker_color='lightgreen'),
        row=1, col=2
    )
    
    # 3. Aspect Ratio Distribution
    fig.add_trace(
        go.Histogram(x=aspect_ratios, nbinsx=30, name='Aspect Ratio',
                    marker_color='lightcoral'),
        row=2, col=1
    )
    
    # 4. Size Scatter Plot
    fig.add_trace(
        go.Scatter(x=widths, y=heights, mode='markers',
                  marker=dict(size=4, opacity=0.6, color='blue'),
                  name='Size Distribution'),
        row=2, col=2
    )
    
    # Update layout
    fig.update_layout(
        title="Image Size Distribution Analysis",
        showlegend=False,
        height=600
    )
    
    # Update axes
    fig.update_xaxes(title_text="Width (px)", row=1, col=1)
    fig.update_xaxes(title_text="Height (px)", row=1, col=2)
    fig.update_xaxes(title_text="Aspect Ratio", row=2, col=1)
    fig.update_xaxes(title_text="Width (px)", row=2, col=2)
    
    fig.update_yaxes(title_text="Count", row=1, col=1)
    fig.update_yaxes(title_text="Count", row=1, col=2)
    fig.update_yaxes(title_text="Count", row=2, col=1)
    fig.update_yaxes(title_text="Height (px)", row=2, col=2)
    
    return fig

def create_marginal_plot_plotly(widths, heights):
    """
    Create marginal plot showing size distribution
    
    Args:
        widths (list): Image widths
        heights (list): Image heights
        
    Returns:
        plotly.graph_objects.Figure: Marginal plot figure
    """
    
    # Create marginal plot
    fig = go.Figure()
    
    # Add scatter plot
    fig.add_trace(go.Scatter(
        x=widths, y=heights,
        mode='markers',
        marker=dict(
            size=4,
            opacity=0.6,
            color='blue',
            line=dict(width=0.5, color='white')
        ),
        name='Size Distribution'
    ))
    
    # Add marginal histograms
    fig.add_trace(go.Histogram(
        x=widths, y=heights,
        name='Width Distribution',
        marker_color='lightblue',
        opacity=0.7
    ))
    
    # Update layout
    fig.update_layout(
        title="Image Size Distribution with Marginal Plots",
        xaxis_title="Width (px)",
        yaxis_title="Height (px)",
        height=500
    )
    
    return fig

# Example usage
if __name__ == "__main__":
    # Sample data
    np.random.seed(42)
    widths = np.random.normal(500, 100, 1000)
    heights = np.random.normal(375, 75, 1000)
    aspect_ratios = widths / heights
    
    # Create plots
    fig1 = create_size_distribution_plotly(widths, heights, aspect_ratios)
    fig2 = create_marginal_plot_plotly(widths, heights)
    
    # Show plots
    fig1.show()
    fig2.show()
