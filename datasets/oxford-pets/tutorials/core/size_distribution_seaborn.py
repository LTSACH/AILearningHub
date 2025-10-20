"""
Core EDA - Image Size Distribution Analysis (Seaborn)
"""

import seaborn as sns
import matplotlib.pyplot as plt
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
    
    # Create DataFrame
    df = pd.DataFrame({
        'width': widths,
        'height': heights,
        'aspect_ratio': aspect_ratios
    })
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Image Size Distribution Analysis', fontsize=16)
    
    # Main scatter plot
    sns.scatterplot(data=df, x='width', y='height', hue='aspect_ratio', 
                   palette='viridis', ax=axes[0, 0])
    axes[0, 0].set_title('Width vs Height')
    
    # Width distribution
    sns.histplot(data=df, x='width', bins=30, ax=axes[0, 1])
    axes[0, 1].set_title('Width Distribution')
    
    # Height distribution
    sns.histplot(data=df, x='height', bins=30, ax=axes[1, 0])
    axes[1, 0].set_title('Height Distribution')
    
    # Aspect ratio distribution
    sns.histplot(data=df, x='aspect_ratio', bins=30, ax=axes[1, 1])
    axes[1, 1].set_title('Aspect Ratio Distribution')
    
    plt.tight_layout()
    plt.show()
    
    # Print statistics
    print(f"Total images analyzed: {len(widths)}")
    print(f"Mean width: {np.mean(widths):.0f}px")
    print(f"Mean height: {np.mean(heights):.0f}px")
    print(f"Mean aspect ratio: {np.mean(aspect_ratios):.2f}")

if __name__ == "__main__":
    # Example usage
    data_dir = "path/to/your/dataset"
    analyze_image_sizes(data_dir)
