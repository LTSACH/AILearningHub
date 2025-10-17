# Oxford-IIIT Pet Dataset (Sample)

**Representative samples for demonstration and education**

---

## 📊 Dataset Overview

### Original Dataset:
- **Name**: Oxford-IIIT Pet Dataset
- **Source**: [Visual Geometry Group, University of Oxford](https://www.robots.ox.ac.uk/~vgg/data/pets/)
- **Total Images**: 7,349
- **Breeds**: 37 (12 cat breeds + 25 dog breeds)
- **Tasks**: Classification, Object Detection, Semantic Segmentation

### This Sample:
- **Images**: 370 representative samples (~5% of full dataset)
- **Breeds**: 37 (100% coverage)
- **Selection**: Stratified sampling (10 images per breed)
- **Purpose**: Educational demonstration, portfolio showcase
- **Size**: ~37 MB

---

## 📁 Contents

```
data/
├── sample_images/           # 370 JPG images
│   ├── cats/               # 120 cat images (12 breeds)
│   │   ├── Abyssinian_*.jpg
│   │   ├── Bengal_*.jpg
│   │   ├── Birman_*.jpg
│   │   ├── Bombay_*.jpg
│   │   ├── British_Shorthair_*.jpg
│   │   ├── Egyptian_Mau_*.jpg
│   │   ├── Maine_Coon_*.jpg
│   │   ├── Persian_*.jpg
│   │   ├── Ragdoll_*.jpg
│   │   ├── Russian_Blue_*.jpg
│   │   ├── Siamese_*.jpg
│   │   └── Sphynx_*.jpg
│   │
│   └── dogs/               # 250 dog images (25 breeds)
│       ├── american_bulldog_*.jpg
│       ├── american_pit_bull_terrier_*.jpg
│       ├── basset_hound_*.jpg
│       ├── beagle_*.jpg
│       ├── boxer_*.jpg
│       ├── chihuahua_*.jpg
│       ├── english_cocker_spaniel_*.jpg
│       ├── english_setter_*.jpg
│       ├── german_shorthaired_*.jpg
│       ├── great_pyrenees_*.jpg
│       ├── havanese_*.jpg
│       ├── japanese_chin_*.jpg
│       ├── keeshond_*.jpg
│       ├── leonberger_*.jpg
│       ├── miniature_pinscher_*.jpg
│       ├── newfoundland_*.jpg
│       ├── pomeranian_*.jpg
│       ├── pug_*.jpg
│       ├── saint_bernard_*.jpg
│       ├── samoyed_*.jpg
│       ├── scottish_terrier_*.jpg
│       ├── shiba_inu_*.jpg
│       ├── staffordshire_bull_terrier_*.jpg
│       ├── wheaten_terrier_*.jpg
│       └── yorkshire_terrier_*.jpg
│
├── sample_gallery.json        # Gallery organization by breed
├── sample_metadata.json       # Sample statistics & metadata
└── sample_images_mapping.json # Image name to path mapping
```

---

## 📈 Statistics

### Distribution:
```
Total Samples: 370
Breeds: 37

By Species:
- Cats:  120 images (32.4%)
- Dogs:  250 images (67.6%)

Per Breed:
- Min: 10 images
- Max: 10 images
- Avg: 10 images
```

### Selection Method:
- **Strategy**: Stratified sampling
- **Random seed**: 42 (reproducible)
- **Criteria**: Equal representation per breed
- **Source split**: Training set of full dataset

---

## 🎯 Use Cases

### 1. Data Analysis & EDA
```
→ See: 01_Data_Analysis/01_EDA/oxford_pets_classification/
- Core statistics & visualizations
- Breed distribution analysis
- Feature extraction & similarity
```

### 2. Machine Learning Models
```
Future:
- Image classification (37 classes)
- Transfer learning experiments
- Model comparison benchmarks
```

### 3. Computer Vision Tasks
```
Future:
- Object detection
- Semantic segmentation
- Multi-task learning
```

### 4. Educational Demos
```
- Dataset exploration tutorials
- Visualization techniques
- Deep learning workshops
```

---

## 📖 Citation

If you use this dataset sample in your work, please cite the original dataset:

```bibtex
@InProceedings{parkhi12a,
  author       = "Parkhi, O. M. and Vedaldi, A. and Zisserman, A. and Jawahar, C.~V.",
  title        = "Cats and Dogs",
  booktitle    = "IEEE Conference on Computer Vision and Pattern Recognition",
  year         = "2012",
}
```

**Full attribution**: See [ATTRIBUTION.md](ATTRIBUTION.md)

---

## ⚖️ License & Usage

### Original Dataset:
- Publicly available for academic and research purposes
- Citation required
- See official source for full terms

### This Sample:
- **Purpose**: Educational/Portfolio demonstration
- **Usage**: Academic and educational purposes only
- **Attribution**: Required (see ATTRIBUTION.md)
- **Commercial use**: Not permitted without authorization

---

## 🔗 Links

### Official Resources:
- **Dataset Homepage**: https://www.robots.ox.ac.uk/~vgg/data/pets/
- **Paper**: [Cats and Dogs (IEEE CVPR 2012)](https://www.robots.ox.ac.uk/~vgg/publications/2012/parkhi12a/)
- **Contact**: Visual Geometry Group, Oxford

### This Repository:
- **EDA Reports**: [oxford_pets_classification](../../01_Data_Analysis/01_EDA/oxford_pets_classification/)
- **GitHub Code**: https://github.com/LTSACH/AITraining
- **GitHub Pages**: https://github.com/LTSACH/AILearningHub

---

## 📊 Breed List

### Cat Breeds (12):
1. Abyssinian
2. Bengal
3. Birman
4. Bombay
5. British Shorthair
6. Egyptian Mau
7. Maine Coon
8. Persian
9. Ragdoll
10. Russian Blue
11. Siamese
12. Sphynx

### Dog Breeds (25):
1. American Bulldog
2. American Pit Bull Terrier
3. Basset Hound
4. Beagle
5. Boxer
6. Chihuahua
7. English Cocker Spaniel
8. English Setter
9. German Shorthaired
10. Great Pyrenees
11. Havanese
12. Japanese Chin
13. Keeshond
14. Leonberger
15. Miniature Pinscher
16. Newfoundland
17. Pomeranian
18. Pug
19. Saint Bernard
20. Samoyed
21. Scottish Terrier
22. Shiba Inu
23. Staffordshire Bull Terrier
24. Wheaten Terrier
25. Yorkshire Terrier

---

## 💡 Tips

### Loading Images:
```python
import pandas as pd
from pathlib import Path
from PIL import Image

# Load metadata
metadata = pd.read_json('data/sample_metadata.json')

# Load gallery
with open('data/sample_gallery.json') as f:
    gallery = json.load(f)

# Load a sample image
img_path = Path('data/sample_images/cats/Abyssinian_100.jpg')
img = Image.open(img_path)
```

### Using in Reports:
```html
<!-- Relative path from EDA folder -->
<img src="../../datasets/oxford-pets/data/sample_images/cats/Abyssinian_100.jpg">
```

---

## 🔄 Updates

- **2025-01**: Initial sample selection (370 images)
- **2025-01**: Restructured to datasets/ directory

---

**Maintainer**: AI Learning Hub  
**Last Updated**: January 2025  
**Version**: 1.0.0

