"""
Core EDA - Color Distribution Analysis (Matplotlib)
"""

import matplotlib.pyplot as plt
import numpy as np
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
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Color Distribution Analysis', fontsize=16)
    
    # RGB boxplot
    axes[0, 0].boxplot([mean_r, mean_g, mean_b], labels=['Red', 'Green', 'Blue'])
    axes[0, 0].set_ylabel('Mean Channel Value')
    axes[0, 0].set_title('RGB Channel Distribution')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Red channel histogram
    axes[0, 1].hist(mean_r, bins=30, color='red', alpha=0.7)
    axes[0, 1].set_xlabel('Mean Red Value')
    axes[0, 1].set_ylabel('Frequency')
    axes[0, 1].set_title('Red Channel Distribution')
    
    # Green channel histogram
    axes[1, 0].hist(mean_g, bins=30, color='green', alpha=0.7)
    axes[1, 0].set_xlabel('Mean Green Value')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].set_title('Green Channel Distribution')
    
    # Blue channel histogram
    axes[1, 1].hist(mean_b, bins=30, color='blue', alpha=0.7)
    axes[1, 1].set_xlabel('Mean Blue Value')
    axes[1, 1].set_ylabel('Frequency')
    axes[1, 1].set_title('Blue Channel Distribution')
    
    plt.tight_layout()
    plt.show()
    
    # Print statistics
    print(f"Total images analyzed: {len(mean_r)}")
    print(f"Mean Red: {np.mean(mean_r):.1f}")
    print(f"Mean Green: {np.mean(mean_g):.1f}")
    print(f"Mean Blue: {np.mean(mean_b):.1f}")
    print(f"Mean Brightness: {np.mean(brightness_values):.1f}")

# Run analysis
if __name__ == "__main__":
    analyze_color_distribution("data")

