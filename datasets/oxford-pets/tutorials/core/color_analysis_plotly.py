"""
Core EDA - Color Distribution Analysis (Plotly)
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np
import pandas as pd
from pathlib import Path
from PIL import Image

def analyze_color_distribution(data_dir: str):
    """Analyze image color distributions and create visualizations"""
    
    # Load image data
    image_dir = Path(data_dir) / "images"
    image_files = list(image_dir.glob("**/*.jpg")) + list(image_dir.glob("**/*.png"))
    
    # Extract color statistics
    mean_r, mean_g, mean_b = [], [], []
    brightness_values = []
    
    for img_path in image_files[:100]:  # Sample first 100 images
        try:
            with Image.open(img_path).convert('RGB') as img:
                img_array = np.array(img)
                mean_r.append(img_array[:, :, 0].mean())
                mean_g.append(img_array[:, :, 1].mean())
                mean_b.append(img_array[:, :, 2].mean())
                brightness_values.append(img_array.mean())
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            continue
    
    # Create subplots
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('RGB Channel Distribution', 'Red Channel', 'Green Channel', 'Blue Channel')
    )
    
    # RGB boxplot
    fig.add_trace(
        go.Box(y=mean_r, name='Red', marker_color='red'),
        row=1, col=1
    )
    fig.add_trace(
        go.Box(y=mean_g, name='Green', marker_color='green'),
        row=1, col=1
    )
    fig.add_trace(
        go.Box(y=mean_b, name='Blue', marker_color='blue'),
        row=1, col=1
    )
    
    # Individual histograms
    fig.add_trace(
        go.Histogram(x=mean_r, nbinsx=30, name='Red', marker_color='red'),
        row=1, col=2
    )
    fig.add_trace(
        go.Histogram(x=mean_g, nbinsx=30, name='Green', marker_color='green'),
        row=2, col=1
    )
    fig.add_trace(
        go.Histogram(x=mean_b, nbinsx=30, name='Blue', marker_color='blue'),
        row=2, col=2
    )
    
    fig.update_layout(
        title_text="Color Distribution Analysis",
        height=800,
        showlegend=False
    )
    
    fig.show()
    
    # Print statistics
    print(f"Total images analyzed: {len(mean_r)}")
    print(f"Mean Red: {np.mean(mean_r):.1f}")
    print(f"Mean Green: {np.mean(mean_g):.1f}")
    print(f"Mean Blue: {np.mean(mean_b):.1f}")
    print(f"Mean Brightness: {np.mean(brightness_values):.1f}")

# Run analysis
if __name__ == "__main__":
    analyze_color_distribution("data")

