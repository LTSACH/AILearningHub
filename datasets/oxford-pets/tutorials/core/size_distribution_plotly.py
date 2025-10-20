"""
Core EDA - Image Size Distribution Analysis (Plotly)
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np
import pandas as pd
from pathlib import Path
from PIL import Image

def analyze_image_sizes(data_dir: str):
    """Analyze image dimensions and create visualizations"""
    
    # Load image data
    image_dir = Path(data_dir) / "images"
    image_files = list(image_dir.glob("**/*.jpg")) + list(image_dir.glob("**/*.png"))
    
    # Extract dimensions
    widths, heights, aspect_ratios = [], [], []
    
    for img_path in image_files[:100]:  # Sample first 100 images
        try:
            with Image.open(img_path) as img:
                w, h = img.size
                widths.append(w)
                heights.append(h)
                aspect_ratios.append(w / h)
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            continue
    
    # Create marginal plot
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Width vs Height', 'Width Distribution', 'Height Distribution', 'Aspect Ratio Distribution'),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )
    
    # Main scatter plot
    fig.add_trace(
        go.Scatter(
            x=widths, y=heights,
            mode='markers',
            marker=dict(
                size=4,
                color=aspect_ratios,
                colorscale='Viridis',
                showscale=True,
                colorbar=dict(title="Aspect Ratio")
            ),
            name='Images',
            hovertemplate='Width: %{x}<br>Height: %{y}<br>Aspect Ratio: %{marker.color:.2f}<extra></extra>'
        ),
        row=1, col=1
    )
    
    # Width histogram
    fig.add_trace(
        go.Histogram(x=widths, nbinsx=30, name='Width', marker_color='lightblue'),
        row=1, col=2
    )
    
    # Height histogram
    fig.add_trace(
        go.Histogram(x=heights, nbinsx=30, name='Height', marker_color='lightgreen'),
        row=2, col=1
    )
    
    # Aspect ratio histogram
    fig.add_trace(
        go.Histogram(x=aspect_ratios, nbinsx=30, name='Aspect Ratio', marker_color='lightcoral'),
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
    fig.update_yaxes(title_text="Height (px)", row=1, col=1)
    fig.update_xaxes(title_text="Width (px)", row=1, col=2)
    fig.update_xaxes(title_text="Height (px)", row=2, col=1)
    fig.update_xaxes(title_text="Aspect Ratio", row=2, col=2)
    
    # Show plot
    fig.show()
    
    # Print statistics
    print(f"Total images analyzed: {len(widths)}")
    print(f"Mean width: {np.mean(widths):.0f}px")
    print(f"Mean height: {np.mean(heights):.0f}px")
    print(f"Mean aspect ratio: {np.mean(aspect_ratios):.2f}")

if __name__ == "__main__":
    # Example usage
    data_dir = "path/to/your/dataset"
    analyze_image_sizes(data_dir)
