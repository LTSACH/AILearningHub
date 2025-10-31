/**
 * Mindmap Data Structure
 * Full hierarchy of Machine Learning techniques
 */

export const mlMindmapData = {
  name: "Machine Learning",
  group: "center",
  description: "Field of AI that enables systems to learn patterns from data.",
  children: [
    {
      name: "Supervised",
      group: "supervised",
      description: "Learning from labeled data: classification & regression.",
      children: [
        {
          name: "Classification",
          description: "Predicting discrete class labels.",
          children: [
            {
              name: "Naive Bayes",
              description: "Probabilistic classifiers with naive independence.",
              children: [
                { name: "GaussianNB" },
                { name: "MultinomialNB" },
                { name: "BernoulliNB" },
                { name: "ComplementNB" },
                { name: "CategoricalNB" }
              ]
            },
            {
              name: "Linear Models",
              description: "Linear decision functions.",
              children: [
                { name: "LogisticRegression" },
                { name: "SGDClassifier" },
                { name: "Perceptron" },
                { name: "PassiveAggressiveClassifier" }
              ]
            },
            {
              name: "SVM",
              description: "Margin-based classifiers.",
              children: [
                { name: "SVC" },
                { name: "LinearSVC" },
                { name: "NuSVC" }
              ]
            },
            {
              name: "Neural Net",
              description: "Feed-forward neural networks.",
              children: [
                { name: "MLPClassifier" }
              ]
            },
            {
              name: "Trees & Ensembles",
              description: "Tree-based models and ensembles.",
              children: [
                { name: "DecisionTreeClassifier" },
                { name: "ExtraTreeClassifier" },
                { name: "RandomForestClassifier" },
                { name: "ExtraTreesClassifier" },
                { name: "GradientBoostingClassifier" },
                { name: "HistGradientBoostingClassifier" },
                { name: "BaggingClassifier (meta)" },
                { name: "AdaBoostClassifier (meta)" },
                { name: "StackingClassifier (meta)" },
                { name: "VotingClassifier (meta)" }
              ]
            },
            {
              name: "Neighbors",
              description: "Instance-based methods.",
              children: [
                { name: "KNeighborsClassifier" },
                { name: "RadiusNeighborsClassifier" },
                { name: "NearestCentroid" }
              ]
            },
            {
              name: "Discriminant Analysis",
              description: "Class-conditional Gaussians.",
              children: [
                { name: "LinearDiscriminantAnalysis" },
                { name: "QuadraticDiscriminantAnalysis" }
              ]
            },
            {
              name: "Multi-Output & Strategies",
              description: "Wrappers and strategies.",
              children: [
                { name: "OneVsRestClassifier (meta)" },
                { name: "OneVsOneClassifier (meta)" },
                { name: "OutputCodeClassifier (meta)" },
                { name: "ClassifierChain (meta)" },
                { name: "MultiOutputClassifier (meta)" },
                { name: "CalibratedClassifierCV (meta)" }
              ]
            }
          ]
        },
        {
          name: "Regression",
          description: "Predicting continuous numeric values.",
          children: [
            {
              name: "Linear Models",
              description: "Linear regression family.",
              children: [
                { name: "LinearRegression" },
                { name: "Ridge / RidgeCV" },
                { name: "Lasso / LassoCV" },
                { name: "ElasticNet / ElasticNetCV" },
                { name: "Lars / LassoLars" },
                { name: "OrthogonalMatchingPursuit" },
                { name: "BayesianRidge" },
                { name: "HuberRegressor" },
                { name: "RANSACRegressor" },
                { name: "TheilSenRegressor" }
              ]
            },
            {
              name: "GLM",
              description: "Generalized linear models.",
              children: [
                { name: "PoissonRegressor" },
                { name: "GammaRegressor" },
                { name: "TweedieRegressor" }
              ]
            },
            {
              name: "SVM",
              description: "Support Vector Regression.",
              children: [
                { name: "SVR" },
                { name: "LinearSVR" },
                { name: "NuSVR" }
              ]
            },
            {
              name: "Neural Net",
              description: "Feed-forward neural networks.",
              children: [
                { name: "MLPRegressor" }
              ]
            },
            {
              name: "Trees & Ensembles",
              description: "Tree-based models and ensembles.",
              children: [
                { name: "DecisionTreeRegressor" },
                { name: "ExtraTreeRegressor" },
                { name: "RandomForestRegressor" },
                { name: "ExtraTreesRegressor" },
                { name: "GradientBoostingRegressor" },
                { name: "HistGradientBoostingRegressor" },
                { name: "BaggingRegressor (meta)" },
                { name: "AdaBoostRegressor (meta)" },
                { name: "StackingRegressor (meta)" },
                { name: "VotingRegressor (meta)" }
              ]
            },
            {
              name: "Neighbors",
              description: "Instance-based methods.",
              children: [
                { name: "KNeighborsRegressor" },
                { name: "RadiusNeighborsRegressor" }
              ]
            },
            {
              name: "Multi-Output & Strategies",
              description: "Wrappers and strategies.",
              children: [
                { name: "MultiOutputRegressor (meta)" },
                { name: "RegressorChain (meta)" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Unsupervised",
      group: "unsupervised",
      description: "Learning from unlabeled data.",
      children: [
        {
          name: "Clustering",
          description: "Grouping similar samples.",
          children: [
            { name: "KMeans / MiniBatchKMeans" },
            { name: "DBSCAN" },
            { name: "OPTICS" },
            { name: "AgglomerativeClustering" },
            { name: "SpectralClustering" },
            { name: "GaussianMixture (mixture)" },
            { name: "BayesianGaussianMixture" },
            { name: "Birch" },
            { name: "AffinityPropagation" },
            { name: "MeanShift" }
          ]
        },
        {
          name: "Dimensionality Reduction",
          description: "Reducing feature dimensionality.",
          children: [
            { name: "PCA" },
            { name: "IncrementalPCA" },
            { name: "KernelPCA" },
            { name: "TruncatedSVD" },
            { name: "NMF" },
            { name: "DictionaryLearning" },
            { name: "MiniBatchDictionaryLearning" },
            { name: "SparsePCA" },
            { name: "MiniBatchSparsePCA" },
            { name: "FactorAnalysis" },
            { name: "FastICA" },
            { name: "LatentDirichletAllocation" },
            { name: "t-SNE" }
          ]
        },
        {
          name: "Manifold Learning",
          description: "Nonlinear embeddings preserving geometry.",
          children: [
            { name: "Isomap" },
            { name: "MDS" },
            { name: "SpectralEmbedding" },
            { name: "LocallyLinearEmbedding" }
          ]
        },
        {
          name: "Density & Anomaly",
          description: "Density estimation / outlier detection.",
          children: [
            { name: "KernelDensity" },
            { name: "IsolationForest" },
            { name: "OneClassSVM" },
            { name: "LocalOutlierFactor" },
            { name: "EllipticEnvelope" }
          ]
        }
      ]
    },
    {
      name: "Reinforcement Learning",
      group: "rl",
      description: "Learning by reward-based interaction (not in sklearn core).",
      children: [
        { name: "Q-Learning" },
        { name: "DQN" }
      ]
    },
    {
      name: "Semi-supervised",
      group: "semi",
      description: "Using few labels + many unlabeled.",
      children: [
        { name: "LabelPropagation" },
        { name: "LabelSpreading" },
        { name: "SelfTrainingClassifier" }
      ]
    },
    {
      name: "Meta / Model selection",
      group: "meta",
      description: "Composition and model selection utilities.",
      children: [
        { name: "Pipeline" },
        { name: "ColumnTransformer" },
        { name: "FeatureUnion" },
        { name: "TransformedTargetRegressor" },
        { name: "GridSearchCV" },
        { name: "RandomizedSearchCV" },
        { name: "HalvingGridSearchCV" },
        { name: "HalvingRandomSearchCV" },
        { name: "CrossValidate / cross_val_score" },
        { name: "StackingClassifier" },
        { name: "StackingRegressor" },
        { name: "VotingClassifier" },
        { name: "VotingRegressor" },
        { name: "OneVsRestClassifier" },
        { name: "OneVsOneClassifier" },
        { name: "ClassifierChain" },
        { name: "RegressorChain" },
        { name: "MultiOutputClassifier" },
        { name: "MultiOutputRegressor" },
        { name: "CalibratedClassifierCV" }
      ]
    }
  ]
};

/**
 * Beginner-friendly algorithms (should be visible in beginner mode)
 */
export const BEGINNER_ALGORITHMS = [
  'GaussianNB', 'MultinomialNB', 'LogisticRegression',
  'LinearRegression', 'Ridge', 'SVC', 'SVR',
  'KMeans / MiniBatchKMeans', 'PCA',
  'RandomForestClassifier', 'DecisionTreeClassifier',
  'KNeighborsClassifier', 'LabelPropagation'
];

