from catboost import CatBoostRegressor
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
model = CatBoostRegressor()
model = model.load_model("models/forest_fire_regressor.cbm")
pd.set_option('display.max_columns', None)
columns = ['latitude', 'longitude', 'brightness', 'scan', 'track', 'acq_date',
           'acq_time', 'satellite', 'instrument', 'version',
           'bright_t31', 'frp', 'daynight', 'type']

def preprocess_forest_data(forest):
    # Drop unnecessary columns
    forest = forest.drop(['instrument', 'version'], axis=1)

    # Map categorical values
    daynight_map = {"D": 1, "N": 0}
    satellite_map = {"Terra": 1, "Aqua": 0}
    forest['daynight'] = forest['daynight'].map(daynight_map)
    forest['satellite'] = forest['satellite'].map(satellite_map)

    # One-hot encode 'type' column
    types = pd.get_dummies(forest['type'])
    forest = pd.concat([forest, types], axis=1)
    forest = forest.rename(columns={0: 'type_0', 2: 'type_2', 3: 'type_3'})

    # Drop unnecessary columns
    forest = forest.drop(['type_0', 'type'], axis=1)

    # Convert 'acq_date' to datetime and extract year, month, and day
    forest['acq_date'] = pd.to_datetime(forest['acq_date'])
    forest['year'] = forest['acq_date'].dt.year
    forest['month'] = forest['acq_date'].dt.month
    forest['day'] = forest['acq_date'].dt.day
    forest = forest.drop(['acq_date'], axis=1)

    # One-hot encode 'month' column
    months = pd.get_dummies(forest['month'])
    forest = pd.concat([forest, months], axis=1)
    forest = forest.rename(columns={8: 'August'})

    # Drop unnecessary columns
    forest = forest.drop(['month', 9, 'year'], axis=1)

    # Drop 'scan' and 'acq_time' columns
    forest = forest.drop(['scan', 'acq_time'], axis=1)

    # Categorize 'brightness' column
    def bright_categorize(brightness):
        if brightness < 316.5:
            return 'Low'
        elif 336.7 <= brightness <= 351.0:
            return 'High'
        else:
            return 'Extreme'

    forest['brightness_temperature'] = forest['brightness'].apply(bright_categorize)
    forest['brightness_temperature'] = forest['brightness_temperature'].map({'Low': 0, 'High': 1, 'Extreme': 2})
    forest = forest.drop(['brightness'], axis=1)
    def area_categorize(row):
        longitude = row['longitude']
        latitude = row['latitude']
    
        if longitude < 122.8051765 or -30.000233 < latitude < -25.760321:
            return 'Western Australia'
        elif 122.8051765 < longitude < 132.551000 or -20.917574 < latitude < 19.4914:
            return 'Northern Territory'
        elif 132.551000 < longitude < 136.209152 or -31.840233 < latitude < -30.000233:
            return 'South Australia'
        elif 144.964600 < longitude < 145.612793 or -37.020100 < latitude < -31.840233:
            return 'New South Wales'
        elif 142.702789 < longitude < 144.964600 or latitude < -37.020100:
            return 'Victoria'
        elif 136.209152 < longitude < 142.702789 or -25.760321 < latitude < -20.917574:
            return 'Queensland'
        else:
            return 'Unidentified'
    # Apply 'area_categorize' function to create 'Area of Fire' column
    forest['Area of Fire'] = forest.apply(area_categorize, axis=1)
    forest['Area of Fire'] = forest['Area of Fire'].map({'Western Australia': 0, 'Queensland': 1, 'South Australia': 2,
                                                         'New South Wales': 3, 'Northern Territory': 4, 'Victoria': 5})

    # Standardize and apply PCA to selected columns
    columns_for_pca = ['brightness_temperature', 'bright_t31', 'daynight']
    data_for_pca = forest[columns_for_pca]

    scaler = StandardScaler()
    data_for_pca_scaled = scaler.fit_transform(data_for_pca)

    pca = PCA(n_components=1)
    principal_components = pca.fit_transform(data_for_pca_scaled)

    columns_pca = [f'PC{i + 1}' for i in range(pca.n_components_)]
    principal_components_df = pd.DataFrame(data=principal_components, columns=columns_pca)

    # Concatenate the PCA components to the dataframe
    forest = pd.concat([forest, principal_components_df], axis=1)

    # Drop unnecessary columns after PCA
    forest = forest.drop(['bright_t31', 'daynight', 'brightness_temperature'], axis=1)

    return forest

def forest_preprocess(data):
    forest = pd.read_csv('models/fire_archive_M6_96619.csv')
    forest = forest.drop(['confidence'], axis = 1)
    forest.loc[len(forest)] = data
    
    preprocessed_data = preprocess_forest_data(forest)
    prediction = model.predict(preprocessed_data.tail(1))
    return prediction[0]