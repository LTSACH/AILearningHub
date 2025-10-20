"""
Core EDA - Color Distribution Analysis (Seaborn)
"""

import seaborn as sns
import matplotlib.pyplot as plt
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
    
    # Create DataFrame
    df = pd.DataFrame({
        'Red': mean_r,
        'Green': mean_g,
        'Blue': mean_b
    })
    
    # Set style
    sns.set_style("whitegrid")
    
    # Create subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('Color Distribution Analysis', fontsize=16)
    
    # RGB boxplot
    df_melted = df.melt(var_name='Channel', value_name='Mean Value')
    sns.boxplot(data=df_melted, x='Channel', y='Mean Value', ax=axes[0, 0])
    axes[0, 0].set_title('RGB Channel Distribution')
    
    # Red channel histogram
    sns.histplot(data=df, x='Red', bins=30, color='red', ax=axes[0, 1])
    axes[0, 1].set_title('Red Channel Distribution')
    
    # Green channel histogram
    sns.histplot(data=df, x='Green', bins=30, color='green', ax=axes[1, 0])
    axes[1, 0].set_title('Green Channel Distribution')
    
    # Blue channel histogram
    sns.histplot(data=df, x='Blue', bins=30, color='blue', ax=axes[1, 1])
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

