"""
Core EDA - Image Size Distribution Analysis (Matplotlib)
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
from PIL import Image
import seaborn as sns

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
    
    # Create subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Image Size Distribution Analysis', fontsize=16)
    
    # Main scatter plot
    scatter = axes[0, 0].scatter(widths, heights, c=aspect_ratios, cmap='viridis', alpha=0.6)
    axes[0, 0].set_xlabel('Width (px)')
    axes[0, 0].set_ylabel('Height (px)')
    axes[0, 0].set_title('Width vs Height')
    plt.colorbar(scatter, ax=axes[0, 0], label='Aspect Ratio')
    
    # Width histogram
    axes[0, 1].hist(widths, bins=30, color='lightblue', alpha=0.7)
    axes[0, 1].set_xlabel('Width (px)')
    axes[0, 1].set_ylabel('Frequency')
    axes[0, 1].set_title('Width Distribution')
    
    # Height histogram
    axes[1, 0].hist(heights, bins=30, color='lightgreen', alpha=0.7)
    axes[1, 0].set_xlabel('Height (px)')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title('Height Distribution')
    
    # Aspect ratio histogram
    axes[1, 1].hist(aspect_ratios, bins=30, color='lightcoral', alpha=0.7)
    axes[1, 1].set_xlabel('Aspect Ratio')
    axes[1, 1].set_ylabel('Frequency')
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
