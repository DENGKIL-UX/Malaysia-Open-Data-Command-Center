export const DATASETS = [
  {
    "id": "deaths",
    "title_en": "Annual Deaths",
    "title_ms": "Kematian Tahunan",
    "description_en": "Annual number of deaths registered with JPN.",
    "description_ms": "Jumlah kematian tahunan yang didaftarkan dengan JPN.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_district_sex",
    "title_en": "Annual Deaths by District & Sex",
    "title_ms": "Kematian Tahunan mengikut Daerah & Jantina",
    "description_en": "Annual number and rate of deaths by administrative district and sex.",
    "description_ms": "Jumlah dan kadar kematian tahunan mengikut daerah pentadbiran dan jantina.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2022,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_district_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_district_sex.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_sex_ethnic",
    "title_en": "Annual Deaths by Sex & Ethnicity",
    "title_ms": "Kematian Tahunan mengikut Jantina & Etnik",
    "description_en": "Annual number of deaths, with breakdowns by sex and ethnic group.",
    "description_ms": "Jumlah kematian tahunan, dengan pecahan mengikut jantina dan kumpulan etnik.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_sex_ethnic.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_sex_ethnic.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_state",
    "title_en": "Annual Deaths by State",
    "title_ms": "Kematian Tahunan mengikut Negeri",
    "description_en": "Annual number of deaths registered with JPN, by state.",
    "description_ms": "Jumlah kematian tahunan yang didaftarkan dengan JPN, mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_sex_ethnic_state",
    "title_en": "Annual Deaths by State, Sex, & Ethnicity",
    "title_ms": "Kematian Tahunan mengikut Negeri, Jantina & Etnik",
    "description_en": "Annual number of deaths, with breakdowns by sex, ethnic group and state.",
    "description_ms": "Jumlah kematian tahunan, dengan pecahan mengikut jantina, kumpulan etnik dan negeri.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_sex_ethnic_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_sex_ethnic_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_early_childhood",
    "title_en": "Annual Early Childhood Deaths",
    "title_ms": "Kematian Kanak-Kanak Tahunan",
    "description_en": "Annual number of deaths aged less than 5 year old, broken down into perinatal, neonatal, infant and toddler deaths.",
    "description_ms": "Jumlah tahunan kematian yang berumur kurang daripada 5 tahun, dengan pecahan kepada kematian perinatal, neonatal, bayi dan kanak-kanak kecil.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/deaths_early_childhood.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/deaths_early_childhood.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_early_childhood_sex",
    "title_en": "Annual Early Childhood Deaths by Sex",
    "title_ms": "Kematian Kanak-Kanak Tahunan mengikut Jantina",
    "description_en": "Annual number of deaths aged less than 5 year old by sex, broken down into neonatal and infant deaths.",
    "description_ms": "Jumlah tahunan kematian yang berumur kurang daripada 5 tahun mengikut jantina, dengan pecahan kepada kematian neonatal dan bayi.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/deaths_early_childhood_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/deaths_early_childhood_sex.csv",
    "last_updated": "2023-10-17 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "deaths_early_childhood_state",
    "title_en": "Annual Early Childhood Deaths by State",
    "title_ms": "Kematian Kanak-Kanak Tahunan mengikut Negeri",
    "description_en": "Annual number of deaths aged less than 5 year old by state, broken down into perinatal, neonatal, infant and toddler deaths.",
    "description_ms": "Jumlah tahunan kematian yang berumur kurang daripada 5 tahun mengikut negeri, diperincikan ke dalam kematian perinatal, neonatal, bayi dan kanak-kanak kecil.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/deaths_early_childhood_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/deaths_early_childhood_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_early_childhood_state_sex",
    "title_en": "Annual Early Childhood Deaths by State & Sex",
    "title_ms": "Kematian Kanak-Kanak Tahunan mengikut Negeri & Jantina",
    "description_en": "Annual number of deaths aged less than 5 year old by state and sex, broken down into neonatal and infant deaths.",
    "description_ms": "Jumlah tahunan kematian yang berumur kurang daripada 5 tahun mengikut negeri dan jantina, dengan pecahan kepada kematian neonatal dan bayi.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/deaths_early_childhood_state_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/deaths_early_childhood_state_sex.csv",
    "last_updated": "2023-10-17 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "births_annual",
    "title_en": "Annual Live Births",
    "title_ms": "Kelahiran Hidup Tahunan",
    "description_en": "Annual number of births with signs of life upon delivery.",
    "description_ms": "Jumlah kelahiran tahunan yang bernyawa semasa dilahirkan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/birth.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/birth.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "births_district_sex",
    "title_en": "Annual Live Births by District & Sex",
    "title_ms": "Kelahiran Hidup Tahunan mengikut Daerah & Jantina",
    "description_en": "Annual number of births with signs of life upon delivery, by district and sex.",
    "description_ms": "Jumlah kelahiran tahunan yang bernyawa semasa dilahirkan, mengikut daerah dan jantina.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2022,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/birth_district_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/birth_district_sex.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "births_annual_sex_ethnic",
    "title_en": "Annual Live Births by Sex & Ethnicity",
    "title_ms": "Kelahiran Hidup Tahunan mengikut Jantina & Etnik",
    "description_en": "Annual number of births with signs of life upon delivery, with breakdowns by sex and ethnic group.",
    "description_ms": "Jumlah kelahiran tahunan yang bernyawa semasa dilahirkan, dengan pecahan mengikut jantina dan kumpulan etnik.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/birth_sex_ethnic.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/birth_sex_ethnic.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "births_annual_state",
    "title_en": "Annual Live Births by State",
    "title_ms": "Kelahiran Hidup Tahunan mengikut Negeri",
    "description_en": "Annual number of births with signs of life upon delivery, by state.",
    "description_ms": "Jumlah kelahiran tahunan yang bernyawa semasa dilahirkan, mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/birth_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/birth_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "births_annual_sex_ethnic_state",
    "title_en": "Annual Live Births by State, Sex, & Ethnicity",
    "title_ms": "Kelahiran Hidup Tahunan mengikut Negeri, Jantina & Etnik",
    "description_en": "Annual number of births with signs of life upon delivery, with breakdowns by sex, ethnic group and state.",
    "description_ms": "Jumlah kelahiran tahunan yang bernyawa semasa dilahirkan, dengan pecahan mengikut jantina, kumpulan etnik dan negeri.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/birth_sex_ethnic_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/birth_sex_ethnic_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "marriages_age",
    "title_en": "Annual Marriage by Age Group",
    "title_ms": "Perkahwinan Tahunan mengikut Kumpulan Umur",
    "description_en": "Number of marriages registered annually in Malaysia by age group, including marriage rates per 1,000 unmarried population.",
    "description_ms": "Jumlah perkahwinan yang didaftarkan setiap tahun di Malaysia mengikut kumpulan umur, termasuk kadar perkahwinan bagi setiap 1,000 penduduk yang tidak berkahwin.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Marriage",
    "subcategory_ms": "Perkahwinan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/marriages_age.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/marriages_age.csv",
    "last_updated": "2023-11-23 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "marriages_state_age",
    "title_en": "Annual Marriage by State & Age Group",
    "title_ms": "Perkahwinan Tahunan mengikut Negeri & Kumpulan Umur",
    "description_en": "Number of marriages registered annually by state and age group, including marriage rates per 1,000 unmarried population.",
    "description_ms": "Jumlah perkahwinan yang didaftarkan secara tahunan mengikut negeri dan kumpulan umur, termasuk kadar perkahwinan bagi setiap 1,000 penduduk yang tidak berkahwin.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Marriage",
    "subcategory_ms": "Perkahwinan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/marriages_state_age.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/marriages_state_age.csv",
    "last_updated": "2023-11-23 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "marriages",
    "title_en": "Annual Marriages",
    "title_ms": "Perkahwinan Tahunan",
    "description_en": "Number of marriages registered annually in Malaysia, including marriage rates per 1,000 unmarried population.",
    "description_ms": "Jumlah perkahwinan yang didaftarkan setiap tahun di Malaysia, termasuk kadar perkahwinan bagi setiap 1,000 penduduk yang tidak berkahwin.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Marriage",
    "subcategory_ms": "Perkahwinan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/marriages.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/marriages.csv",
    "last_updated": "2023-11-23 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "marriages_state",
    "title_en": "Annual Marriages by State",
    "title_ms": "Perkahwinan Tahunan mengikut Negeri",
    "description_en": "Number of marriages registered annually by state of residence, including marriage rates per 1,000 unmarried population.",
    "description_ms": "Jumlah perkahwinan yang didaftarkan setiap tahun mengikut negeri kediaman, termasuk kadar perkahwinan bagi setiap 1,000 penduduk yang tidak berkahwin.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Marriage",
    "subcategory_ms": "Perkahwinan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/marriages_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/marriages_state.csv",
    "last_updated": "2023-11-23 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "deaths_maternal",
    "title_en": "Annual Maternal Deaths",
    "title_ms": "Kematian Ibu Bersalin Tahunan",
    "description_en": "Annual number of deaths of women during pregnancy or childbirth.",
    "description_ms": "Jumlah tahunan kematian wanita semasa mengandung atau melahirkan anak.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1933,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_maternal.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_maternal.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "deaths_maternal_state",
    "title_en": "Annual Maternal Deaths by State",
    "title_ms": "Kematian Ibu Bersalin Tahunan mengikut Negeri",
    "description_en": "Annual number of deaths of women during pregnancy or childbirth, by state.",
    "description_ms": "Jumlah tahunan kematian wanita semasa mengandung atau melahirkan anak, mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "JPN",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Deaths",
    "subcategory_ms": "Kematian",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/death_maternal_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/death_maternal_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "stillbirths",
    "title_en": "Annual Stillbirths",
    "title_ms": "Kelahiran Mati Tahunan",
    "description_en": "Annual number of stillbirths recorded by the Ministry of Health.",
    "description_ms": "Jumlah kelahiran mati tahunan yang direkodkan oleh Kementerian Kesihatan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "MOH",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/stillbirth.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/stillbirth.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "stillbirths_state",
    "title_en": "Annual Stillbirths by State",
    "title_ms": "Kelahiran Mati Tahunan mengikut Negeri",
    "description_en": "Annual number of stillbirths recorded by the Ministry of Health, by state.",
    "description_ms": "Jumlah kelahiran mati tahunan yang direkodkan oleh Kementerian Kesihatan, mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "MOH",
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/stillbirth_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/stillbirth_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "births",
    "title_en": "Daily Live Births",
    "title_ms": "Kelahiran Hidup Harian",
    "description_en": "Number of people born daily in Malaysia, based on registrations with JPN from 1920 to the present.",
    "description_ms": "Jumlah orang yang lahir secara harian di Malaysia, berdasarkan pendaftaran dengan JPN dari 1920 sehingga kini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1920,
    "dataset_end": 2023,
    "data_source": [
      "JPN"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Births",
    "subcategory_ms": "Kelahiran",
    "category_sort": 1,
    "link_parquet": "https://storage.data.gov.my/demography/births.parquet",
    "link_csv": "https://storage.data.gov.my/demography/births.csv",
    "last_updated": "2023-09-09 08:00",
    "data_as_of": "2023-07-31 23:59"
  },
  {
    "id": "arrivals",
    "title_en": "Monthly Arrivals by Nationality & Sex",
    "title_ms": "Kemasukan Bulanan mengikut Kewarganegaraan & Jantina",
    "description_en": "Monthly foreign arrivals in Malaysia by nationality and sex.",
    "description_ms": "Kemasukan warga asing secara bulanan ke Malaysia mengikut kewarganegaraan dan jantina.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "NATIONALITY"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2024,
    "data_source": [
      "Imigresen"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Migration",
    "subcategory_ms": "Migrasi",
    "category_sort": 1,
    "link_parquet": "https://storage.data.gov.my/demography/arrivals.parquet",
    "link_csv": "https://storage.data.gov.my/demography/arrivals.csv",
    "last_updated": "2024-11-25 16:00",
    "data_as_of": "2024-10-31 23:59"
  },
  {
    "id": "arrivals_soe",
    "title_en": "Monthly Arrivals by State of Entry, Nationality & Sex",
    "title_ms": "Kemasukan Bulanan mengikut Negeri Pintu Masuk, Kewarganegaraan & Jantina",
    "description_en": "Monthly foreign arrivals in Malaysia by state of entry, nationality and sex. The table shows a preview of the full dataset using the latest month of data only.",
    "description_ms": "Kemasukan warga asing secara bulanan ke Malaysia mengikut negeri pintu masuk, kewarganegaraan dan jantina. Jadual memberi pratonton kepada set data dengan menggunakan data bagi bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "NATIONALITY"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2024,
    "data_source": [
      "Imigresen"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Migration",
    "subcategory_ms": "Migrasi",
    "category_sort": 1,
    "link_parquet": "https://storage.data.gov.my/demography/arrivals_soe.parquet",
    "link_csv": "https://storage.data.gov.my/demography/arrivals_soe.csv",
    "last_updated": "2024-11-25 16:00",
    "data_as_of": "2024-10-31 23:59"
  },
  {
    "id": "passports",
    "title_en": "Monthly Passport Issuances by State and Branch",
    "title_ms": "Pengeluaran Pasport Bulanan mengikut Negeri dan Cawangan",
    "description_en": "Monthly issuances of Malaysian passports by state and office.",
    "description_ms": "Pengeluaran pasport Malaysia secara bulanan mengikut negeri dan cawangan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2024,
    "data_source": [
      "Imigresen"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Migration",
    "subcategory_ms": "Migrasi",
    "category_sort": 1,
    "link_parquet": "https://storage.data.gov.my/demography/passports.parquet",
    "link_csv": "https://storage.data.gov.my/demography/passports.csv",
    "last_updated": "2024-11-25 16:00",
    "data_as_of": "2024-10-31 23:59"
  },
  {
    "id": "population_district",
    "title_en": "Population Table: Administrative Districts",
    "title_ms": "Jadual Penduduk: Daerah Pentadbiran",
    "description_en": "Population at district level from 2020 to 2024, by sex, age group and ethnicity. The preview table shows data for the latest year only, but you may download the data in full.",
    "description_ms": "Jumlah penduduk di peringkat daerah dari 2020 ke 2024, mengikut jantina, kumpulan umur dan kumpulan etnik. Jadual pratonton hanya menunjukkan data bagi tahun terkini, tetapi data penuh boleh dimuat tu",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [
      "SEX",
      "ETHNICITY",
      "AGE"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Population",
    "subcategory_ms": "Penduduk",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/population/population_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/population/population_district.csv",
    "last_updated": "2024-08-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "population_malaysia",
    "title_en": "Population Table: Malaysia",
    "title_ms": "Jadual Penduduk: Malaysia",
    "description_en": "Population at national level from 1970 to 2025, by sex, age group and ethnicity. The preview table shows data for the latest year only, but you may download the data in full.",
    "description_ms": "Jumlah penduduk di peringkat nasional dari 1970 ke 2025, mengikut jantina, kumpulan umur dan kumpulan etnik. Jadual pratonton hanya menunjukkan data bagi tahun terkini, tetapi data penuh boleh dimuat ",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "ETHNICITY",
      "AGE"
    ],
    "dataset_begin": 1970,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Population",
    "subcategory_ms": "Penduduk",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/population/population_malaysia.parquet",
    "link_csv": "https://storage.dosm.gov.my/population/population_malaysia.csv",
    "last_updated": "2025-07-31 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "population_parlimen",
    "title_en": "Population Table: Parliamentary Constituencies",
    "title_ms": "Jadual Penduduk: Kawasan Parlimen",
    "description_en": "Population at parliamentary constituency level from 2020 to 2022, with breakdowns by sex and nationality. The preview table shows data for the latest year only, but you may download the data in full.",
    "description_ms": "Jumlah penduduk di peringkat kawasan parlimen dari 2020 ke 2022, dengan pecahan mengikut jantina dan kewarganegaraan. Jadual pratonton hanya menunjukkan data bagi tahun terkini, tetapi data penuh bole",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Population",
    "subcategory_ms": "Penduduk",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/population/population_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/population/population_parlimen.csv",
    "last_updated": "2023-05-23 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "population_dun",
    "title_en": "Population Table: State Legislative Assemblies (DUNs)",
    "title_ms": "Jadual Penduduk: Dewan Undangan Negeri (DUN)",
    "description_en": "Population at state legislative assembly (DUN) level from 2020 to 2022, with breakdowns by sex and nationality. The preview table shows data for the latest year only, but you may download the data in ",
    "description_ms": "Jumlah penduduk di peringkat dewan undangan negeri (DUN) dari 2020 ke 2022, dengan pecahan mengikut jantina dan kewarganegaraan. Jadual pratonton hanya menunjukkan data bagi tahun terkini, tetapi data",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Population",
    "subcategory_ms": "Penduduk",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/population/population_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/population/population_dun.csv",
    "last_updated": "2023-05-23 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "population_state",
    "title_en": "Population Table: States",
    "title_ms": "Jadual Penduduk: Negeri",
    "description_en": "Population at state level from 1970 to 2025, by sex, age group and ethnicity. The preview table shows data for the latest year only, but you may download the data in full.",
    "description_ms": "Jumlah penduduk di peringkat negeri dari 1970 ke 2025, mengikut jantina, kumpulan umur dan kumpulan etnik. Jadual pratonton hanya menunjukkan data bagi tahun terkini, tetapi data penuh boleh dimuat tu",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [
      "SEX",
      "ETHNICITY",
      "AGE"
    ],
    "dataset_begin": 1970,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Population",
    "subcategory_ms": "Penduduk",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/population/population_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/population/population_state.csv",
    "last_updated": "2025-07-31 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "fertility",
    "title_en": "TFR and ASFR",
    "title_ms": "TFR dan ASFR",
    "description_en": "Total fertility rate (TFR) and age-specific fertility rates (ASFR) from 1958 to the present at national level.",
    "description_ms": "Kadar kesuburan keseluruhan (TFR) dan kadar kesuburan mengikut umur (ASFR) dari 1958 hingga kini di peringkat nasional.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1958,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Fertility",
    "subcategory_ms": "Kesuburan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/fertility.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/fertility.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "fertility_state",
    "title_en": "TFR and ASFR by State",
    "title_ms": "TFR dan ASFR mengikut Negeri",
    "description_en": "Total fertility rate (TFR) and age-specific fertility rates (ASFR) by state.",
    "description_ms": "Kadar kesuburan keseluruhan (TFR) dan kadar kesuburan mengikut umur (ASFR) mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2001,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Demography",
    "category_ms": "Demografi",
    "subcategory_en": "Fertility",
    "subcategory_ms": "Kesuburan",
    "category_sort": 1,
    "link_parquet": "https://storage.dosm.gov.my/demography/fertility_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/fertility_state.csv",
    "last_updated": "2024-10-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "hh_access_amenities",
    "title_en": "Access to Basic Amenities by State & District",
    "title_ms": "Akses kepada Kemudahan Asas mengikut Negeri & Daerah",
    "description_en": "Proportion of households with access to basic amenities such as electricity, piped water, and sanitary latrines by state and district.",
    "description_ms": "Nisbah isi rumah dengan akses kepada kemudahan asas seperti elektrik, air paip, dan tandas sempurna mengikut negeri dan daerah.",
    "frequency": "YEARLY",
    "geography": [
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Basic Amenities",
    "subcategory_ms": "Kemudahan Asas",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_access_amenities.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_access_amenities.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_expenditure_dun",
    "title_en": "Household Expenditure by DUN",
    "title_ms": "Perbelajaan Isi Rumah mengikut DUN",
    "description_en": "Mean gross monthly household expenditure by DUN constituency from 2019 to 2024.",
    "description_ms": "Purata dan penengah perbelajaan kasar bulanan isi rumah mengikut kawasan DUN dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Expenditure",
    "subcategory_ms": "Perbelanjaan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_expenditure_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_expenditure_dun.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_expenditure_parlimen",
    "title_en": "Household Expenditure by Parliament",
    "title_ms": "Perbelajaan Isi Rumah mengikut Parlimen",
    "description_en": "Mean gross monthly household expenditure by parliamentary constituency from 2019 to 2024.",
    "description_ms": "Purata dan penengah perbelajaan kasar bulanan isi rumah mengikut kawasan parlimen dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Expenditure",
    "subcategory_ms": "Perbelanjaan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_expenditure_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_expenditure_parlimen.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_income",
    "title_en": "Household Income",
    "title_ms": "Pendapatan Isi Rumah",
    "description_en": "Mean and median monthly gross household income in Malaysia from 1970 to 2022.",
    "description_ms": "Purata dan penengah pendapatan kasar bulanan isi rumah di Malaysia dari 1970 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_income.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_income.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hies_district",
    "title_en": "Household Income and Expenditure: Administrative Districts",
    "title_ms": "Pendapatan dan Perbelanjaan Isi Rumah: Daerah Pentadbiran",
    "description_en": "This dataset tabulates household-level income, expenditure, poverty, and income inequality at administrative district level. It is based on the Household Income & Expenditure Surveys (HIES) carried in",
    "description_ms": "Set data ini menunjukkan pendapatan, perbelanjaan, ketidaksamaan pendapatan, dan kadar kemiskinan bagi isi rumah di peringkat daerah pentadbiran. Data ini dihasilkan berdasarkan Survei Pendapatan dan ",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Expenditure",
    "subcategory_ms": "Perbelanjaan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hies_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hies_district.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hies_state",
    "title_en": "Household Income and Expenditure: States",
    "title_ms": "Pendapatan dan Perbelanjaan Isi Rumah: Negeri",
    "description_en": "This dataset tabulates household-level income, expenditure, poverty, and income inequality at state level. It is based on the Household Income & Expenditure Surveys (HIES) carried in 2022.",
    "description_ms": "Set data ini menunjukkan pendapatan, perbelanjaan, ketidaksamaan pendapatan, dan kadar kemiskinan bagi isi rumah di peringkat negeri. Data ini dihasilkan berdasarkan Survei Pendapatan dan Isi Rumah (H",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Expenditure",
    "subcategory_ms": "Perbelanjaan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hies_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hies_state.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_income_district",
    "title_en": "Household Income by Administrative District",
    "title_ms": "Pendapatan Isi Rumah Mengikut Daerah Pentadbiran",
    "description_en": "Mean and median gross monthly household income by administrative district from 2019 to 2022.",
    "description_ms": "Purata dan penengah pendapatan kasar bulanan isi rumah mengikut daerah pentadbiran dari 2019 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_income_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_income_district.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_income_dun",
    "title_en": "Household Income by DUN",
    "title_ms": "Pendapatan Isi Rumah mengikut DUN",
    "description_en": "Mean and median gross monthly household income by DUN constituency from 2019 to 2024.",
    "description_ms": "Purata dan penengah pendapatan kasar bulanan isi rumah mengikut kawasan DUN dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_income_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_income_dun.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_income_parlimen",
    "title_en": "Household Income by Parliament",
    "title_ms": "Pendapatan Isi Rumah mengikut Parlimen",
    "description_en": "Mean and median gross monthly household income by parliamentary constituency from 2019 to 2024.",
    "description_ms": "Purata dan penengah pendapatan kasar bulanan isi rumah mengikut kawasan parlimen dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_income_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_income_parlimen.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hies_malaysia_percentile",
    "title_en": "Household Income by Percentile",
    "title_ms": "Pendapatan Isi Rumah mengikut Persentil",
    "description_en": "Percentile-resolution household income data at national level.",
    "description_ms": "Data pendapatan isi rumah nasional pada resolusi persentil.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hies_malaysia_percentile.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hies_malaysia_percentile.csv",
    "last_updated": "2025-10-08 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_income_state",
    "title_en": "Household Income by State",
    "title_ms": "Pendapatan Isi Rumah Mengikut Negeri",
    "description_en": "Mean and median gross monthly household income by state from 1970 to 2022.",
    "description_ms": "Purata dan penengah pendapatan kasar bulanan isi rumah mengikut negeri dari 1970 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_income_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_income_state.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hies_state_percentile",
    "title_en": "Household Income by State & Percentile",
    "title_ms": "Pendapatan Isi Rumah mengikut Negeri & Persentil",
    "description_en": "Percentile-resolution household income data at state level.",
    "description_ms": "Data pendapatan isi rumah peringkat negeri pada resolusi persentil.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Income",
    "subcategory_ms": "Pendapatan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hies_state_percentile.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hies_state_percentile.csv",
    "last_updated": "2025-10-08 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_inequality",
    "title_en": "Income Inequality",
    "title_ms": "Ketidaksamarataan Pendapatan",
    "description_en": "Gini coefficient for Malaysia from 1970 to 2022.",
    "description_ms": "Pekali Gini untuk Malaysia dari 1970 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Inequality",
    "subcategory_ms": "Ketidaksamarataan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_inequality.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_inequality.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_inequality_district",
    "title_en": "Income Inequality by District",
    "title_ms": "Ketidaksamarataan Pendapatan mengikut Daerah",
    "description_en": "Gini coefficient by administrative district from 2019 to 2022.",
    "description_ms": "Pekali Gini mengikut daerah pentadbiran dari 2019 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Inequality",
    "subcategory_ms": "Ketidaksamarataan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_inequality_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_inequality_district.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_inequality_dun",
    "title_en": "Income Inequality by DUN",
    "title_ms": "Ketidaksamarataan Pendapatan mengikut DUN",
    "description_en": "Gini coefficient at DUN constituency level from 2019 to 2024.",
    "description_ms": "Pekali Gini di peringkat kawasan DUN dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Inequality",
    "subcategory_ms": "Ketidaksamarataan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_inequality_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_inequality_dun.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_inequality_parlimen",
    "title_en": "Income Inequality by Parliament",
    "title_ms": "Ketidaksamarataan Pendapatan mengikut Parlimen",
    "description_en": "Gini coefficient by parliamentary constituency from 2019 to 2024.",
    "description_ms": "Pekali Gini mengikut kawasan parlimen dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Inequality",
    "subcategory_ms": "Ketidaksamarataan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_inequality_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_inequality_parlimen.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_inequality_state",
    "title_en": "Income Inequality by State",
    "title_ms": "Ketidaksamarataan Pendapatan mengikut Negeri",
    "description_en": "Gini coefficient by state from 1974 to 2022.",
    "description_ms": "Pekali Gini mengikut negeri dari 1974 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 1974,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Inequality",
    "subcategory_ms": "Ketidaksamarataan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_inequality_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_inequality_state.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_profile",
    "title_en": "Number of Households and Living Quarters",
    "title_ms": "Bilangan Isi Rumah dan Tempat Kediaman",
    "description_en": "Number of households and living quarters in Malaysia from 1970 to 2024.",
    "description_ms": "Bilangan isi rumah dan tempat kediaman di Malaysia dari 1970 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Profile",
    "subcategory_ms": "Profil",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/demography/hh_lq.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/hh_lq.csv",
    "last_updated": "2024-07-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_profile_state",
    "title_en": "Number of Households and Living Quarters by State",
    "title_ms": "Bilangan Isi Rumah dan Tempat Kediaman mengikut Negeri",
    "description_en": "Number of households and living quarters by state from 1970 to 2024.",
    "description_ms": "Bilangan isi rumah dan tempat kediaman mengikut negeri dari 1970 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Profile",
    "subcategory_ms": "Profil",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/demography/hh_lq_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/demography/hh_lq_state.csv",
    "last_updated": "2024-07-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_poverty",
    "title_en": "Poverty",
    "title_ms": "Kemiskinan",
    "description_en": "Poverty rates in Malaysia from 1970 to 2022.",
    "description_ms": "Kadar kemiskinan di Malaysia dari 1970 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Poverty",
    "subcategory_ms": "Kemiskinan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_poverty.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_poverty.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_poverty_district",
    "title_en": "Poverty by Administrative District",
    "title_ms": "Kemiskinan mengikut Daerah Pentadbiran",
    "description_en": "Poverty rates by administrative district from 2019 to 2022.",
    "description_ms": "Kadar kemiskinan mengikut daerah pentadbiran dari 2019 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Poverty",
    "subcategory_ms": "Kemiskinan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_poverty_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_poverty_district.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "hh_poverty_dun",
    "title_en": "Poverty by DUN",
    "title_ms": "Kemiskinan mengikut DUN",
    "description_en": "Poverty rates by DUN constituency from 2019 to 2024.",
    "description_ms": "Kadar kemiskinan mengikut kawasan DUN dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Poverty",
    "subcategory_ms": "Kemiskinan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_poverty_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_poverty_dun.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_poverty_parlimen",
    "title_en": "Poverty by Parliament",
    "title_ms": "Kemiskinan mengikut Parlimen",
    "description_en": "Poverty rates by parliamentary constituency from 2019 to 2024.",
    "description_ms": "Kadar kemiskinan mengikut kawasan parlimen dari 2019 hingga 2024.",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Poverty",
    "subcategory_ms": "Kemiskinan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_poverty_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_poverty_parlimen.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "hh_poverty_state",
    "title_en": "Poverty by State",
    "title_ms": "Kemiskinan Mengikut Negeri",
    "description_en": "Poverty rates by state from 1970 to 2022.",
    "description_ms": "Kadar kemiskinan mengikut negeri dari 1970 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Households",
    "category_ms": "Isi Rumah",
    "subcategory_en": "Poverty",
    "subcategory_ms": "Kemiskinan",
    "category_sort": 2,
    "link_parquet": "https://storage.dosm.gov.my/hies/hh_poverty_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/hies/hh_poverty_state.csv",
    "last_updated": "2023-07-28 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "gdp_gni_annual_nominal",
    "title_en": "Annual Nominal GDP & GNI: 1947 to Present",
    "title_ms": "KDNK & PNK Sebenar Tahunan: 1947 sehingga Kini",
    "description_en": "Long time series of annual nominal gross domestic product (GDP) and gross national income (GNI), including per capita values.",
    "description_ms": "Siri masa panjang keluaran dalam negeri kasar (KDNK) serta pendapatan nasional kasar (PNK) pada harga semasa, termasuk nilai per kapita.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1947,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_gni_annual_nominal.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_gni_annual_nominal.csv",
    "last_updated": "2026-02-13 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "gdp_annual_nominal_supply",
    "title_en": "Annual Nominal GDP by Economic Sector",
    "title_ms": "KDNK Nominal Tahunan mengikut Sektor Ekonomi",
    "description_en": "Annual gross domestic product (GDP) at current prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga semasa bagi 5 sektor ekonomi utama.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_supply.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_nominal_supply_granular",
    "title_en": "Annual Nominal GDP by Economic Subsector",
    "title_ms": "KDNK Nominal Tahunan mengikut Subsektor Ekonomi",
    "description_en": "Annual gross domestic product (GDP) at current prices by economic subsector. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga semasa mengikut subsektor ekonomi. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_supply_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_supply_sub.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_nominal_demand_granular",
    "title_en": "Annual Nominal GDP by Expenditure Subtype",
    "title_ms": "KDNK Nominal Tahunan mengikut Subjenis Perbelanjaan",
    "description_en": "Annual gross domestic product (GDP) at current prices, by expenditure type and subtype. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga semasa, mengikut jenis dan subjenis perbelanjaan. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_demand_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_demand_sub.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_nominal_demand",
    "title_en": "Annual Nominal GDP by Expenditure Type",
    "title_ms": "KDNK Nominal Tahunan mengikut Jenis Perbelanjaan",
    "description_en": "Annual gross domestic product (GDP) at current prices, by expenditure type.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga semasa, mengikut jenis perbelanjaan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_demand.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_demand.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_nominal_income",
    "title_en": "Annual Nominal GDP by Income Component",
    "title_ms": "KDNK Nominal Tahunan mengikut Komponen Pendapatan",
    "description_en": "Annual gross domestic product (GDP) at current prices, by income component.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga semasa, mengikut komponen pendapatan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_income.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_nominal_income.csv",
    "last_updated": "2025-07-30 12:00",
    "data_as_of": "2024"
  },
  {
    "id": "gdp_gni_annual_real",
    "title_en": "Annual Real GDP & GNI: 1970 to Present",
    "title_ms": "KDNK & PNK Sebenar Tahunan: 1970 sehingga Kini",
    "description_en": "Long time series of annual real gross domestic product (GDP) and gross national income (GNI), including per capita values.",
    "description_ms": "Siri masa panjang keluaran dalam negeri kasar (KDNK) serta pendapatan nasional kasar (PNK) pada harga malar 2015, termasuk nilai per kapita.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_gni_annual_real.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_gni_annual_real.csv",
    "last_updated": "2026-02-13 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "gdp_district_real_supply",
    "title_en": "Annual Real GDP by District & Economic Sector",
    "title_ms": "KDNK Sebenar Tahunan mengikut Daerah & Sektor Ekonomi",
    "description_en": "Annual district-level gross domestic product (GDP) at constant 2015 prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan peringkat daerah pada harga malar 2015 bagi 5 sektor ekonomi utama.",
    "frequency": "YEARLY",
    "geography": [
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2020,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_district_real_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_district_real_supply.csv",
    "last_updated": "2024-11-02 12:00",
    "data_as_of": "2020"
  },
  {
    "id": "gdp_annual_real_supply",
    "title_en": "Annual Real GDP by Economic Sector",
    "title_ms": "KDNK Sebenar Tahunan mengikut Sektor Ekonomi",
    "description_en": "Annual gross domestic product (GDP) at constant 2015 prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga malar 2015 bagi 5 sektor ekonomi utama.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_real_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_real_supply.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_real_supply_granular",
    "title_en": "Annual Real GDP by Economic Subsector",
    "title_ms": "KDNK Sebenar Tahunan mengikut Subsektor Ekonomi",
    "description_en": "Annual gross domestic product (GDP) at constant 2015 prices by economic subsector. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga malar 2015 mengikut subsektor ekonomi. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_real_supply_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_real_supply_sub.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_real_demand_granular",
    "title_en": "Annual Real GDP by Expenditure Subtype",
    "title_ms": "KDNK Sebenar Tahunan mengikut Subjenis Perbelanjaan",
    "description_en": "Annual gross domestic product (GDP) at constant 2015 prices, by expenditure type and subtype. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga malar 2015, mengikut jenis dan subjenis perbelanjaan. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_real_demand_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_real_demand_sub.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_annual_real_demand",
    "title_en": "Annual Real GDP by Expenditure Type",
    "title_ms": "KDNK Sebenar Tahunan mengikut Jenis Perbelanjaan",
    "description_en": "Annual gross domestic product (GDP) at constant 2015 prices, by expenditure type.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan pada harga malar 2015, mengikut jenis perbelanjaan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_annual_real_demand.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_annual_real_demand.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "gdp_state_real_supply",
    "title_en": "Annual Real GDP by State & Economic Sector",
    "title_ms": "KDNK Sebenar Tahunan mengikut Negeri & Sektor Ekonomi",
    "description_en": "Annual state-level gross domestic product (GDP) at constant 2015 prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) tahunan peringkat negeri pada harga malar 2015 bagi 5 sektor ekonomi utama.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_state_real_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_state_real_supply.csv",
    "last_updated": "2024-07-02 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "bop_balance",
    "title_en": "Balance of Key BOP Components",
    "title_ms": "Baki Komponen Utama BOP",
    "description_en": "Overall balance of the 4 main components of Malaysia's balance of payments (BOP).",
    "description_ms": "Baki keseluruhan 4 komponen utama dalam imbangan pembayaran (BOP) Malaysia.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Balance of Payments",
    "subcategory_ms": "Imbangan Pembayaran",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/bop/bop_balance.parquet",
    "link_csv": "https://storage.dosm.gov.my/bop/bop_balance.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2026-Q1"
  },
  {
    "id": "fdi_flows",
    "title_en": "Foreign Direct Investment (FDI) Flows",
    "title_ms": "Aliran Pelaburan Langsung Asing (FDI)",
    "description_en": "Inflows, outflows, and net flows of foreign direct investment (FDI) into Malaysia.",
    "description_ms": "Aliran masuk, aliran keluar, dan aliran bersih pelaburan langsung asing (FDI) ke Malaysia.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2008,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Balance of Payments",
    "subcategory_ms": "Imbangan Pembayaran",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/bop/fdi_flows.parquet",
    "link_csv": "https://storage.dosm.gov.my/bop/fdi_flows.csv",
    "last_updated": "2025-11-14 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "gdp_lookup",
    "title_en": "Lookup Table: GDP",
    "title_ms": "Jadual Carian: KDNK",
    "description_en": "Lookup table, to be left-joined against other GDP datasets if specified.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan set data KDNK lain sekiranya diperlukan.",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_lookup.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_lookup.csv",
    "last_updated": "2024-05-17 12:00",
    "data_as_of": "2024-Q1"
  },
  {
    "id": "gdp_qtr_nominal",
    "title_en": "Quarterly Nominal GDP",
    "title_ms": "KDNK Nominal Suku Tahunan",
    "description_en": "Quarterly gross domestic product (GDP) at current prices.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga semasa.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_nominal_supply",
    "title_en": "Quarterly Nominal GDP by Economic Sector",
    "title_ms": "KDNK Nominal Suku Tahunan mengikut Sektor Ekonomi",
    "description_en": "Quarterly gross domestic product (GDP) at current prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga semasa bagi 5 sektor ekonomi utama.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_supply.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_nominal_supply_granular",
    "title_en": "Quarterly Nominal GDP by Economic Subsector",
    "title_ms": "KDNK Nominal Suku Tahunan mengikut Subsektor Ekonomi",
    "description_en": "Quarterly gross domestic product (GDP) at current prices by economic subsector. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga semasa mengikut subsektor ekonomi. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_supply_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_supply_sub.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_nominal_demand_granular",
    "title_en": "Quarterly Nominal GDP by Expenditure Subtype",
    "title_ms": "KDNK Nominal Suku Tahunan mengikut Subjenis Perbelanjaan",
    "description_en": "Quarterly gross domestic product (GDP) at current prices, by expenditure type and subtype. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga semasa, mengikut jenis dan subjenis perbelanjaan. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_demand_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_demand_sub.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_nominal_demand",
    "title_en": "Quarterly Nominal GDP by Expenditure Type",
    "title_ms": "KDNK Nominal Suku Tahunan mengikut Jenis Perbelanjaan",
    "description_en": "Quarterly gross domestic product (GDP) at current prices, by expenditure type.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga semasa, mengikut jenis perbelanjaan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_demand.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_nominal_demand.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real",
    "title_en": "Quarterly Real GDP",
    "title_ms": "KDNK Sebenar Suku Tahunan",
    "description_en": "Quarterly gross domestic product (GDP) at constant 2015 prices.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga malar 2015.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_sa",
    "title_en": "Quarterly Real GDP (Seasonally Adjusted)",
    "title_ms": "KDNK Sebenar Suku Tahunan (Terlaras secara Musim)",
    "description_en": "Seasonally adjusted quarterly gross domestic product (GDP) at constant 2015 prices.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan yang terlaras secara musim, pada harga malar 2015.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_sa_supply",
    "title_en": "Quarterly Real GDP (Seasonally Adjusted) by Economic Sector",
    "title_ms": "KDNK Sebenar Suku Tahunan (Terlaras secara Musim) mengikut Sektor Ekonomi",
    "description_en": "Seasonally adjusted quarterly gross domestic product (GDP) at constant 2015 prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan yang terlaras secara musim pada harga malar 2015 bagi 5 sektor ekonomi utama.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa_supply.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_sa_demand",
    "title_en": "Quarterly Real GDP (Seasonally Adjusted) by Expenditure Type",
    "title_ms": "KDNK Sebenar Suku Tahunan (Terlaras secara Musim) mengikut Jenis Perbelanjaan",
    "description_en": "Seasonally adjusted quarterly gross domestic product (GDP) at constant 2015 prices, by expenditure type.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan yang terlaras secara musim pada harga malar 2015, mengikut jenis perbelanjaan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa_demand.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_sa_demand.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_supply",
    "title_en": "Quarterly Real GDP by Economic Sector",
    "title_ms": "KDNK Sebenar Suku Tahunan mengikut Sektor Ekonomi",
    "description_en": "Quarterly gross domestic product (GDP) at constant 2015 prices for the 5 main economic sectors.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga malar 2015 bagi 5 sektor ekonomi utama.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_supply.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_supply.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_supply_granular",
    "title_en": "Quarterly Real GDP by Economic Subsector",
    "title_ms": "KDNK Sebenar Suku Tahunan mengikut Subsektor Ekonomi",
    "description_en": "Quarterly gross domestic product (GDP) at constant 2015 prices by economic subsector. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga malar 2015 mengikut subsektor ekonomi. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sahaja.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_supply_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_supply_sub.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_demand_granular",
    "title_en": "Quarterly Real GDP by Expenditure Subtype",
    "title_ms": "KDNK Sebenar Suku Tahunan mengikut Subjenis Perbelanjaan",
    "description_en": "Quarterly gross domestic product (GDP) at constant 2015 prices, by expenditure type and subtype. The table provides a preview of the full dataset using the latest year's data only.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga malar 2015, mengikut jenis dan subjenis perbelanjaan. Jadual memberi pratonton kepada set data penuh dengan menggunakan data tahun terkini sa",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_demand_sub.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_demand_sub.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "gdp_qtr_real_demand",
    "title_en": "Quarterly Real GDP by Expenditure Type",
    "title_ms": "KDNK Sebenar Suku Tahunan mengikut Jenis Perbelanjaan",
    "description_en": "Quarterly gross domestic product (GDP) at constant 2015 prices, by expenditure type.",
    "description_ms": "Keluaran dalam negeri kasar (KDNK) suku tahunan pada harga malar 2015, mengikut jenis perbelanjaan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "National Accounts",
    "category_ms": "Akaun Negara",
    "subcategory_en": "Gross Domestic Product",
    "subcategory_ms": "Keluaran Dalam Negeri Kasar",
    "category_sort": 20,
    "link_parquet": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_demand.parquet",
    "link_csv": "https://storage.dosm.gov.my/gdp/gdp_qtr_real_demand.csv",
    "last_updated": "2026-05-15 12:00",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "enrolment_school_district",
    "title_en": "Enrolment in Government Schools by District",
    "title_ms": "Enrolmen di Sekolah Kerajaan mengikut Daerah",
    "description_en": "Number of students enrolled in primary, secondary, and post-secondary government schools at national, state, and district level.",
    "description_ms": "Bilangan pelajar yang berdaftar bagi pendidikan rendah, menengah, dan pasca menengah di sekolah kerajaan di peringkat nasional, negeri, dan daerah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "MOE"
    ],
    "category_en": "Education",
    "category_ms": "Pendidikan",
    "subcategory_en": "Education Outcomes",
    "subcategory_ms": "Prestasi Pendidikan",
    "category_sort": 39,
    "link_parquet": "https://storage.data.gov.my/education/enrolment_school_district.parquet",
    "link_csv": "https://storage.data.gov.my/education/enrolment_school_district.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "lecturers_uni",
    "title_en": "Lecturers in Public Universities by Citizenship & Sex",
    "title_ms": "Pensyarah di Universiti Awam mengikut Kewarganegaraan & Jantina",
    "description_en": "Number of lecturers in public universities at national and state level, broken down by citizenship and sex.",
    "description_ms": "Bilangan pensyarah di universiti awam di peringkat nasional dan negeri, dengan pecahan mengikut kewarganegaraan dan jantina.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "NATIONALITY"
    ],
    "dataset_begin": 2014,
    "dataset_end": 2023,
    "data_source": [
      "MOHE"
    ],
    "category_en": "Education",
    "category_ms": "Pendidikan",
    "subcategory_en": "Education Infrastructure",
    "subcategory_ms": "Infrastruktur Pendidikan",
    "category_sort": 39,
    "link_parquet": "https://storage.data.gov.my/education/lecturers_uni.parquet",
    "link_csv": "https://storage.data.gov.my/education/lecturers_uni.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "schools_district",
    "title_en": "Public Education Institutions by District",
    "title_ms": "Institusi Pendidikan Awam mengikut Daerah",
    "description_en": "Number of primary, secondary, and tertiary public education institutions at national, state, and district level.",
    "description_ms": "Bilangan institusi awam pendidikan rendah, menengah, dan tinggi di peringkat nasional, negeri, dan daerah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "MOE"
    ],
    "category_en": "Education",
    "category_ms": "Pendidikan",
    "subcategory_en": "Education Infrastructure",
    "subcategory_ms": "Infrastruktur Pendidikan",
    "category_sort": 39,
    "link_parquet": "https://storage.data.gov.my/education/schools_district.parquet",
    "link_csv": "https://storage.data.gov.my/education/schools_district.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "completion_school_state",
    "title_en": "School Completion Rates by State",
    "title_ms": "Kadar Tamat Pengajian Sekolah mengikut Negeri",
    "description_en": "Proportion of students who complete primary, lower secondary, and upper secondary education at national and state level.",
    "description_ms": "Peratusan pelajar yang menamatkan pendidikan rendah, menengah rendah, dan menengah atas di peringkat nasional dan negeri.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "MOE"
    ],
    "category_en": "Education",
    "category_ms": "Pendidikan",
    "subcategory_en": "Education Outcomes",
    "subcategory_ms": "Prestasi Pendidikan",
    "category_sort": 39,
    "link_parquet": "https://storage.data.gov.my/education/completion_school_state.parquet",
    "link_csv": "https://storage.data.gov.my/education/completion_school_state.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "teachers_district",
    "title_en": "Teachers in Government Schools by District",
    "title_ms": "Guru di Sekolah Kerajaan mengikut Daerah",
    "description_en": "Number of teachers in primary and secondary government schools at national, state, and district level.",
    "description_ms": "Bilangan guru di sekolah rendah dan menengah kerajaan di peringkat nasional, negeri, dan daerah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "MOE"
    ],
    "category_en": "Education",
    "category_ms": "Pendidikan",
    "subcategory_en": "Education Infrastructure",
    "subcategory_ms": "Infrastruktur Pendidikan",
    "category_sort": 39,
    "link_parquet": "https://storage.data.gov.my/education/teachers_district.parquet",
    "link_csv": "https://storage.data.gov.my/education/teachers_district.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "sanitation_access",
    "title_en": "Access to Sanitary Latrines by State",
    "title_ms": "Akses kepada Tandas Sempurna mengikut Negeri",
    "description_en": "Proportion of households in rural areas covered by sanitary latrines by state.",
    "description_ms": "Peratusan isi rumah di kawasan luar bandar yang diliputi oleh tandas sempurna mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Infrastructure",
    "subcategory_ms": "Infrastruktur Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/sanitation_access.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/sanitation_access.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "pharmaceutical_importers",
    "title_en": "Approved Importers of Pharmaceutical Products",
    "title_ms": "Pengimport Produk Farmaseutikal Berlesen",
    "description_en": "Complete list of approved importers of pharmaceutical products with an active license from NPRA. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh pengimport produk farmaseutikal dengan lesen aktif daripada NPRA. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pharmaceutical_importers.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pharmaceutical_importers.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "cosmetics_manufacturers",
    "title_en": "Approved Manufacturers of Cosmetic Products",
    "title_ms": "Pengilang Produk Kosmetik Berlesen",
    "description_en": "Complete list of approved manufacturers of cosmetic products with an active license from NPRA. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh pengilang produk kosmetik dengan lesen aktif daripada NPRA. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/cosmetic_manufacturers.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/cosmetic_manufacturers.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pharmaceutical_manufacturers",
    "title_en": "Approved Manufacturers of Pharmaceutical Products",
    "title_ms": "Pengilang Produk Farmaseutikal Berlesen",
    "description_en": "Complete list of approved manufacturers of pharmaceutical products with an active license from NPRA. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh pengilang produk farmaseutikal dengan lesen aktif daripada NPRA. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pharmaceutical_manufacturers.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pharmaceutical_manufacturers.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pharmaceutical_products",
    "title_en": "Approved Pharmaceutical Products",
    "title_ms": "Produk Farmaseutikal Diluluskan",
    "description_en": "Complete list of pharmaceutical products approved by the Drug Control Authority. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh produk farmaseutikal yang diluluskan pendaftaran oleh Pihak Berkuasa Kawalan Dadah. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pharmaceutical_products.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pharmaceutical_products.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pharmaceutical_wholesalers",
    "title_en": "Approved Wholesalers of Pharmaceutical Products",
    "title_ms": "Pemborong Produk Farmaseutikal Berlesen",
    "description_en": "Complete list of approved wholesalers of pharmaceutical products with an active license from NPRA. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh pengimport produk farmaseutikal dengan lesen aktif daripada NPRA. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pharmaceutical_wholesalers.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pharmaceutical_wholesalers.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "cosmetic_notifications_cancelled",
    "title_en": "Cancelled Cosmetic Product Notifications",
    "title_ms": "Produk Komestik Dibatalkan Notifikasi",
    "description_en": "Complete list of comsetic products found to contain banned substances, with their notification subsequently cancelled by the Drug Control Authority. The table provides a preview of the dataset using 1",
    "description_ms": "Senarai penuh produk kosmetik yang telah didapati mengandungi bahan larangan, dan seterusnya dibatalkan notifikasinya oleh Pihak Berkuasa Kawalan Dadah. Jadual memberi pratonton kepada set data dengan",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/cosmetic_notifications_cancelled.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/cosmetic_notifications_cancelled.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pharmaceutical_products_cancelled",
    "title_en": "Cancelled Pharmaceutical Products",
    "title_ms": "Produk Farmaseutikal Dibatalkan Pendaftaran",
    "description_en": "Complete list of pharmaceutical products with registrations cancelled by the Drug Control Authority. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh produk farmaseutikal yang dibatalkan pendaftaran oleh Pihak Berkuasa Kawalan Dadah. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pharmaceutical_products_cancelled.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pharmaceutical_products_cancelled.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "blood_donations",
    "title_en": "Daily Blood Donations by Blood Group",
    "title_ms": "Pendermaan Darah Harian mengikut Kumpulan Darah",
    "description_en": "Daily blood donations at national level for each of the 4 major blood groups. The table provides a preview of the dataset using the most recent 2 years of data.",
    "description_ms": "Pendermaan darah harian di peringkat nasional bagi setiap daripada 4 kumpulan darah utama. Jadual memberi pratonton kepada set data dengan menggunakan data daripada 2 tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2006,
    "dataset_end": 2024,
    "data_source": [
      "PDN",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/blood_donations.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/blood_donations.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "blood_donations_state",
    "title_en": "Daily Blood Donations by Blood Group & State",
    "title_ms": "Pendermaan Darah Harian mengikut Kumpulan Darah & Negeri",
    "description_en": "Daily blood donations at state level for each of the 4 major blood groups. The table provides a preview of the dataset using the most recent year of data.",
    "description_ms": "Pendermaan darah harian di peringkat negeri bagi setiap daripada 4 kumpulan darah utama. Jadual memberi pratonton kepada set data dengan menggunakan data daripada tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2006,
    "dataset_end": 2024,
    "data_source": [
      "PDN",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/blood_donations_state.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/blood_donations_state.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "covid_cases_age",
    "title_en": "Daily COVID-19 Cases by Age Group & State",
    "title_ms": "Kes COVID-19 Harian mengikut Kumpulan Umur & Negeri",
    "description_en": "Daily COVID-19 cases at national and state level, broken down by age group.",
    "description_ms": "Kes COVID-19 harian di peringkat kebangsaan dan negeri, dengan pecahan mengikut kumpulan umur.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2023,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/covid_cases_age.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/covid_cases_age.csv",
    "last_updated": "2025-06-01 12:00",
    "data_as_of": "2025-05-31 23:59"
  },
  {
    "id": "covid_cases",
    "title_en": "Daily COVID-19 Cases by State",
    "title_ms": "Kes COVID-19 Harian mengikut Negeri",
    "description_en": "Daily COVID-19 cases at national and state level, with details on imported, recovered, active, and cluster cases.",
    "description_ms": "Kes COVID-19 harian di peringkat kebangsaan dan negeri dengan butiran mengenai kes import, sembuh, aktif dan kluster.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2023,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/covid_cases.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/covid_cases.csv",
    "last_updated": "2025-06-01 12:00",
    "data_as_of": "2025-05-31 23:59"
  },
  {
    "id": "covid_cases_vaxstatus",
    "title_en": "Daily COVID-19 Cases by Vaccination Status & State",
    "title_ms": "Kes COVID-19 Harian mengikut Status Vaksinasi & Negeri",
    "description_en": "Daily COVID-19 cases at national and state level, broken down by vaccination status.",
    "description_ms": "Kes COVID-19 harian di peringkat kebangsaan dan negeri, dengan pecahan mengikut status vaksinasi.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2023,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/covid_cases_vaxstatus.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/covid_cases_vaxstatus.csv",
    "last_updated": "2025-06-01 12:00",
    "data_as_of": "2025-05-31 23:59"
  },
  {
    "id": "vaxreg_covid",
    "title_en": "Daily COVID-19 Vaccine Registrations by State",
    "title_ms": "Pendaftaran Vaksin COVID-19 Harian mengikut Negeri",
    "description_en": "Daily registrations for the COVID-19 vaccine via MySejahtera, at national and state level.",
    "description_ms": "Pendaftaran harian melalui MySejahtera bagi vaksin COVID-19 di peringkat kebangsaan dan negeri.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2021,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/vaxreg_covid.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/vaxreg_covid.csv",
    "last_updated": "2024-01-02 09:00",
    "data_as_of": "2022-02-22 23:59"
  },
  {
    "id": "vaxreg_covid_demog",
    "title_en": "Daily COVID-19 Vaccine Registrations by State, Sex & Age",
    "title_ms": "Pendaftaran Vaksin COVID-19 Harian mengikut Negeri, Jantina & Umur",
    "description_en": "Daily registrations for the COVID-19 vaccine via MySejahtera, at national and state level, broken down by age group and sex. The table below provides a truncated preview of the full dataset.",
    "description_ms": "Pendaftaran harian melalui MySejahtera bagi vaksin COVID-19 di peringkat kebangsaan dan negeri, dengan pecahan mengikut kumpulan umur dan jantina. Jadual di bawah memberi pratoton ringkas kepada set d",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "AGE"
    ],
    "dataset_begin": 2021,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/vaxreg_covid_demog.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/vaxreg_covid_demog.csv",
    "last_updated": "2024-01-02 09:00",
    "data_as_of": "2022-02-22 23:59"
  },
  {
    "id": "organ_pledges",
    "title_en": "Daily Organ Donation Pledges",
    "title_ms": "Ikrar Derma Organ Harian",
    "description_en": "Daily organ donation pledges at national level. The table provides a preview of the dataset using the most recent 2 years of data.",
    "description_ms": "Ikrar penderma organ harian pada peringkat nasional. Jadual memberi pratonton kepada set data dengan menggunakan data daripada 2 tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2009,
    "dataset_end": 2024,
    "data_source": [
      "NTRC",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/organ_pledges.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/organ_pledges.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "organ_pledges_state",
    "title_en": "Daily Organ Donation Pledges by State",
    "title_ms": "Ikrar Derma Organ Harian mengikut Negeri",
    "description_en": "Daily organ donation pledges at state level. The table provides a preview of the dataset using the most recent year of data.",
    "description_ms": "Ikrar penderma organ harian pada peringkat negeri. Jadual memberi pratonton kepada set data dengan menggunakan data daripada tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2009,
    "dataset_end": 2024,
    "data_source": [
      "NTRC",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/organ_pledges_state.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/organ_pledges_state.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pekab40_screenings",
    "title_en": "Daily PeKaB40 Health Screenings",
    "title_ms": "Saringan Kesihatan PeKaB40 Harian",
    "description_en": "Daily healthcare screenings conducted under the PeKaB40 program, at national level. The table provides a preview of the dataset using the most recent 2 years of data.",
    "description_ms": "Saringan kesihatan harian yang dilaksanakan di bawah program PeKaB40, pada peringkat nasional. Jadual memberi pratonton kepada set data dengan menggunakan data daripada 2 tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "PHCorp",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pekab40_screenings.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pekab40_screenings.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "pekab40_screenings_state",
    "title_en": "Daily PeKaB40 Health Screenings by State",
    "title_ms": "Saringan Kesihatan PeKaB40 Harian mengikut Negeri",
    "description_en": "Daily healthcare screenings conducted under the PeKaB40 program, at state level. The table provides a preview of the dataset using the most recent year of data.",
    "description_ms": "Saringan kesihatan harian yang dilaksanakan di bawah program PeKaB40, pada peringkat negeri. Jadual memberi pratonton kepada set data dengan menggunakan data daripada tahun terkini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2024,
    "data_source": [
      "PHCorp",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/pekab40_screenings_state.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/pekab40_screenings_state.csv",
    "last_updated": "2026-05-16 10:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "healthcare_staff",
    "title_en": "Healthcare Staff by State and Staff Type",
    "title_ms": "Kakitangan Kesihatan mengikut Negeri dan Jenis Kakitangan",
    "description_en": "Number of public sector healthcare staff at national and state level, with a breakdown by staff type.",
    "description_ms": "Bilangan kakitangan kesihatan sektor awam di peringkat nasional dan negeri, dengan pecahan mengikut jenis kakitangan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2014,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Infrastructure",
    "subcategory_ms": "Infrastruktur Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/healthcare_staff.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/healthcare_staff.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "hospital_beds",
    "title_en": "Hospital Beds by State and Hospital Type",
    "title_ms": "Katil Hospital mengikut Negeri dan Jenis Hospital",
    "description_en": "Number of public sector hospital beds at national, state, and district level, with a breakdown by hospital type.",
    "description_ms": "Bilangan katil hospital sektor awam di peringkat nasional, negeri, dan daerah, dengan pecahan mengikut jenis hospital.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Infrastructure",
    "subcategory_ms": "Infrastruktur Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/hospital_beds.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/hospital_beds.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "infant_immunisation",
    "title_en": "Infant Immunisation Coverage",
    "title_ms": "Liputan Imunisasi Bayi",
    "description_en": "Annual infant immunisation coverage rates at national level.",
    "description_ms": "Kadar liputan imunisasi bayi di peringkat nasional.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2023,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Programs",
    "subcategory_ms": "Program Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/infant_immunisation.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/infant_immunisation.csv",
    "last_updated": "2024-11-20 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "mnha_moh",
    "title_en": "MNHA: MOH Expenditure on Health",
    "title_ms": "MNHA: Perbelanjaan Kesihatan oleh KKM",
    "description_en": "Annual total expenditure on health by the Ministry of Health Malaysia.",
    "description_ms": "Perbelanjaan kesihatan keseluruhan tahunan oleh Kementerian Kesihatan Malaysia.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2013,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Accounts",
    "subcategory_ms": "Akaun Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/mnha_moh.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/mnha_moh.csv",
    "last_updated": "2024-11-11",
    "data_as_of": "2022"
  },
  {
    "id": "mnha",
    "title_en": "MNHA: Total (TEH) and Current (CHE) Expenditure on Health",
    "title_ms": "MNHA: Perbelanjaan Kesihatan Keseluruhan (TEH) dan Semasa (CHE)",
    "description_en": "Total and current expenditure on health in Malaysia, with a breakdown into public and private sectors.",
    "description_ms": "Perbelanjaan keseluruhan dan semasa untuk kesihatan di Malaysia, dengan pecahan mengikut sektor awam dan swasta.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2013,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Healthcare Accounts",
    "subcategory_ms": "Akaun Kesihatan",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/mnha.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/mnha.csv",
    "last_updated": "2024-11-11",
    "data_as_of": "2022"
  },
  {
    "id": "cosmetic_notifications",
    "title_en": "Notified Cosmetic Products",
    "title_ms": "Produk Komestik Bernotifikasi",
    "description_en": "Complete list of comsetic products notified to and approved by the Drug Control Authority. The table provides a preview of the dataset using 10 records as a sample.",
    "description_ms": "Senarai penuh produk kosmetik yang telah dihantar notifikasi dan diluluskan oleh Pihak Berkuasa Kawalan Dadah. Jadual memberi pratonton kepada set data dengan menggunakan 10 rekod sebagai contoh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "NPRA",
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Regulation",
    "subcategory_ms": "Kawal Selia",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/cosmetic_notifications.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/cosmetic_notifications.csv",
    "last_updated": "2026-05-16 07:32",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "nutrition_children_sex",
    "title_en": "Nutritional Status of Children Under 5 by Sex",
    "title_ms": "Status Nutrisi Kanak-Kanak bawah 5 Tahun mengikut Jantina",
    "description_en": "Distribution of weight-for-age (WAZ), height-for-age (HAZ), and weight-for-height (WHZ) scores for children under 5 years old based on WHO standards, which are used to assess malnutrition (underweight",
    "description_ms": "Taburan skor berat-untuk-umur (WAZ), tinggi-untuk-umur (HAZ), dan berat-untuk-tinggi (WHZ) untuk kanak-kanak bawah 5 tahun berdasarkan piawaian WHO, yang digunakan untuk menilai malnutrisi (kekurangan",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2019,
    "dataset_end": 2019,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "General Health",
    "subcategory_ms": "Kesihatan Umum",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/nutrition_status_u5_sex.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/nutrition_status_u5_sex.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2019"
  },
  {
    "id": "nutrition_children_strata",
    "title_en": "Nutritional Status of Children Under 5 by Strata",
    "title_ms": "Status Nutrisi Kanak-Kanak bawah 5 Tahun mengikut Strata",
    "description_en": "Distribution of weight-for-age (WAZ), height-for-age (HAZ), and weight-for-height (WHZ) scores for children under 5 years old based on WHO standards, which are used to assess malnutrition (underweight",
    "description_ms": "Taburan skor berat-untuk-umur (WAZ), tinggi-untuk-umur (HAZ), dan berat-untuk-tinggi (WHZ) untuk kanak-kanak bawah 5 tahun berdasarkan piawaian WHO, yang digunakan untuk menilai malnutrisi (kekurangan",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2019,
    "dataset_end": 2019,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "General Health",
    "subcategory_ms": "Kesihatan Umum",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/nutrition_status_u5_strata.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/nutrition_status_u5_strata.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2019"
  },
  {
    "id": "std_state",
    "title_en": "Sexually Transmitted Diseases (STDs) by State",
    "title_ms": "Jangkitan Transmisi Seksual (STD) mengikut Negeri",
    "description_en": "Number and incidence of sexually transmitted diseases (STDs) by state, covering HIV, AIDS, chancroid, gonorrhea, and syphilis.",
    "description_ms": "Bilangan dan kadar insiden jangkitan transmisi seksual (STD) mengikut negeri, meliputi HIV, AIDS, chancroid, gonorrhea, dan sifilis.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/std_state.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/std_state.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "covid_deaths_linelist",
    "title_en": "Transactional Records: Deaths due to COVID-19",
    "title_ms": "Rekod Transaksi: Kematian disebabkan oleh COVID-19",
    "description_en": "Transactional records of deaths due to COVID-19, with various demographic and medical dimensions including COVID-19 vaccination records. The preview shows the most recent 200 records.",
    "description_ms": "Rekod transaksi kematian disebabkan oleh COVID-19, dengan pelbagai dimensi demografi dan perubatan termasuk rekod vaksinasi COVID-19. Pratonton menunjukkan 200 rekod terkini.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX",
      "AGE"
    ],
    "dataset_begin": 2020,
    "dataset_end": 2024,
    "data_source": [
      "MOH"
    ],
    "category_en": "Healthcare",
    "category_ms": "Kesihatan",
    "subcategory_en": "Infectious Diseases",
    "subcategory_ms": "Penyakit Berjangkit",
    "category_sort": 40,
    "link_parquet": "https://storage.data.gov.my/healthcare/covid_deaths_linelist.parquet",
    "link_csv": "https://storage.data.gov.my/healthcare/covid_deaths_linelist.csv",
    "last_updated": "2025-06-01 12:00",
    "data_as_of": "2025-05-31 23:59"
  },
  {
    "id": "registration_transactions_car",
    "title_en": "Car Registration Transactions",
    "title_ms": "Transaksi Pendaftaran Kereta",
    "description_en": "Car registration transactions from 2000 to the present. The table below provides a preview of the full dataset, which contains hundreds of thousands of transactions per year.",
    "description_ms": "Transaksi pendaftaran kereta dari 2000 sehingga kini. Jadual di bawah memberi pratonton kepada dataset penuh yang mengandungi beratus ribu transaksi bagi setiap tahun.",
    "frequency": "DAILY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "JPJ",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Vehicle Registrations",
    "subcategory_ms": "Pendaftaran Kenderaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/cars_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/cars_YYYY-MM-DD.csv",
    "last_updated": "2026-05-10 13:05",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "ridership_ktmb_daily",
    "title_en": "Daily KTMB Ridership",
    "title_ms": "Penggunaan Harian Perkhidmatan KTMB",
    "description_en": "Daily-frequency ridership data for the 5 main KTMB services, namely Komuter, Komuter Utara, Intercity, ETS and Shuttle Tebrau. The table and charts provide a preview of the data using the most recent ",
    "description_ms": "Data penggunaan perkhidmatan KTMB berfrekuensi harian untuk 5 perkhidmatan utama KTMB, iaitu Komuter, Komuter Utara, Antarabandar, ETS dan Shuttle Tebrau. Jadual dan carta memberi pratonton kepada set",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/ridership_ktmb_daily.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/ridership_ktmb_daily.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_od_brt_daily",
    "title_en": "Daily Origin-Destination Ridership: BRT Sunway Line",
    "title_ms": "Penumpang Asal-Destinasi Harian: BRT Laluan Sunway",
    "description_en": "Daily origin-destination ridership data covering all 7 stop on the BRT Sunway Line. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi harian merangkumi kesemua 7 hentian bagi BRT Laluan Sunway. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuhnya.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "Prasarana",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/bus/brt_YYYY-MM-DD_daily.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/bus/brt_YYYY-MM-DD_daily.csv",
    "last_updated": "2026-05-15 14:50",
    "data_as_of": "2026-05-14 23:59"
  },
  {
    "id": "ridership_od_rapidrail_daily",
    "title_en": "Daily Origin-Destination Ridership: Rapid Rail (KV)",
    "title_ms": "Penumpang Asal-Destinasi Harian: Rapid Rail (KV)",
    "description_en": "Daily origin-destination ridership data covering the entire Rapid Rail network in the Klang Valley. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi harian untuk jaringan Rapid Rail di Lembah Klang. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "Prasarana",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/rail/rapidrail_YYYY-MM-DD_daily.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/rail/rapidrail_YYYY-MM-DD_daily.csv",
    "last_updated": "2026-05-15 14:50",
    "data_as_of": "2026-05-14 23:59"
  },
  {
    "id": "ridership_headline",
    "title_en": "Daily Public Transport Ridership",
    "title_ms": "Penggunaan Pengangkutan Awam Harian",
    "description_en": "Daily-frequency ridership data for various public transport services across the country.",
    "description_ms": "Data penggunaan pengangkutan awam berfrekuensi harian daripada beberapa perkhidmatan pengangkutan awam di seluruh negara.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2023,
    "data_source": [
      "Prasarana",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ridership_headline.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ridership_headline.csv",
    "last_updated": "2026-05-12 12:00",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "ridership_od_ets",
    "title_en": "Hourly Origin-Destination Ridership: ETS",
    "title_ms": "Penumpang Asal-Destinasi secara Jam: ETS",
    "description_en": "Hourly origin-destination ridership data for the ETS service. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi secara jam untuk perkhidmatan ETS. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/ets_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/ets_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_od_intercity",
    "title_en": "Hourly Origin-Destination Ridership: Intercity",
    "title_ms": "Penumpang Asal-Destinasi secara Jam: Antarabandar",
    "description_en": "Hourly origin-destination ridership data for the Intercity service. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi secara jam untuk perkhidmatan Antarabandar. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/intercity_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/intercity_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_od_komuter",
    "title_en": "Hourly Origin-Destination Ridership: Komuter",
    "title_ms": "Penumpang Asal-Destinasi secara Jam: Komuter",
    "description_en": "Hourly origin-destination ridership data for the Komuter service. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi secara jam untuk perkhidmatan Komuter. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/komuter_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/komuter_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_od_komuter_utara",
    "title_en": "Hourly Origin-Destination Ridership: Komuter Utara",
    "title_ms": "Penumpang Asal-Destinasi secara Jam: Komuter Utara",
    "description_en": "Hourly origin-destination ridership data for the Komuter Utara service. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi secara jam untuk perkhidmatan Komuter Utara. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/komuter_utara_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/komuter_utara_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_od_shuttle_tebrau",
    "title_en": "Hourly Origin-Destination Ridership: Shuttle Tebrau",
    "title_ms": "Penumpang Asal-Destinasi secara Jam: Shuttle Tebrau",
    "description_en": "Hourly origin-destination ridership data for the Shuttle Tebrau service. The table provides a brief preview of the data, but you may download the data in full.",
    "description_ms": "Data penumpang asal-destinasi secara jam untuk perkhidmatan Shuttle Tebrau. Jadual memberikan pratonton kepada set data, tetapi anda boleh memuat turun set data penuh.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/shuttle_tebrau_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/shuttle_tebrau_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 03:31",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "ridership_ktmb_monthly",
    "title_en": "Monthly KTMB Ridership",
    "title_ms": "Penggunaan Bulanan Perkhidmatan KTMB",
    "description_en": "Monthly-frequency ridership data for the 5 main KTMB services, namely Komuter, Komuter Utara, Intercity, ETS and Shuttle Tebrau.",
    "description_ms": "Data penggunaan perkhidmatan KTMB berfrekuensi bulanan untuk 5 perkhidmatan utama KTMB, iaitu Komuter, Komuter Utara, Antarabandar, ETS dan Shuttle Tebrau.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2025,
    "data_source": [
      "KTMB",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Ridership",
    "subcategory_ms": "Penggunaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/ktmb/ridership_ktmb_monthly.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/ktmb/ridership_ktmb_monthly.csv",
    "last_updated": "2026-05-01 03:31",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "registrations_type_fuel",
    "title_en": "Monthly Vehicle Registrations by Vehicle and Fuel Type",
    "title_ms": "Pendaftaran Kenderaan Bulanan mengikut Jenis Kenderaan dan Bahan Bakar",
    "description_en": "Monthly count of vehicle registrations, disaggregated by vehicle type and fuel type, from 2000 to the present.",
    "description_ms": "Bilangan pendaftaran kenderaan bulanan, dengan pecahan mengikut jenis kenderaan dan jenis bahan bakar, dari tahun 2000 sehingga kini.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "JPJ",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Vehicle Registrations",
    "subcategory_ms": "Pendaftaran Kenderaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/registrations_type_fuel.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/registrations_type_fuel.csv",
    "last_updated": "2026-05-10 13:05",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "registration_transactions_motorcycle",
    "title_en": "Motorcycle Registration Transactions",
    "title_ms": "Transaksi Pendaftaran Motosikal",
    "description_en": "Motorcycle registration transactions from 2000 to the present. The table below provides a preview of the full dataset, which contains hundreds of thousands of transactions per year.",
    "description_ms": "Transaksi pendaftaran motosikal dari 2000 sehingga kini. Jadual di bawah memberi pratonton kepada dataset penuh yang mengandungi beratus ribu transaksi bagi setiap tahun.",
    "frequency": "DAILY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "JPJ",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Vehicle Registrations",
    "subcategory_ms": "Pendaftaran Kenderaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/motorcycles_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/motorcycles_YYYY-MM-DD.csv",
    "last_updated": "2026-05-10 13:05",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "registration_transactions_all",
    "title_en": "Vehicle Registration Transactions",
    "title_ms": "Transaksi Pendaftaran Kenderaan",
    "description_en": "All vehicle registration transactions from 2000 to the present. The table below provides a preview of the full dataset, which contains hundreds of thousands of transactions per year.",
    "description_ms": "Semua transaksi pendaftaran kenderaan dari 2000 sehingga kini. Jadual di bawah memberi pratonton kepada dataset penuh yang mengandungi beratus ribu transaksi bagi setiap tahun.",
    "frequency": "DAILY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "JPJ",
      "MOT"
    ],
    "category_en": "Transportation",
    "category_ms": "Pengangkutan",
    "subcategory_en": "Vehicle Registrations",
    "subcategory_ms": "Pendaftaran Kenderaan",
    "category_sort": 41,
    "link_parquet": "https://storage.data.gov.my/transportation/vehicles_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/transportation/vehicles_YYYY-MM-DD.csv",
    "last_updated": "2026-05-10 13:05",
    "data_as_of": "2026-04-30 23:59"
  },
  {
    "id": "crime_district",
    "title_en": "Crimes by District & Crime Type",
    "title_ms": "Jenayah mengikut Daerah & Jenis Jenayah",
    "description_en": "Number of crimes in Malaysia by district, crime category, and type of crime.",
    "description_ms": "Bilangan jenayah di Malaysia mengikut daerah, kategori jenayah, dan jenis jenayah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2023,
    "data_source": [
      "PDRM",
      "DOSM"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Crime",
    "subcategory_ms": "Jenayah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/crime_district.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/crime_district.csv",
    "last_updated": "2024-10-16 12:00",
    "data_as_of": "2023-12-31 23:59"
  },
  {
    "id": "drug_addicts_education",
    "title_en": "Drug Addicts by Highest Education Level",
    "title_ms": "Penagih Dadah Mengikut Tahap Pendidikan Tertinggi",
    "description_en": "The dataset provides information on drug addicts categorized by their highest level of education. The data is collected by the National Anti-Drugs Agency (NADA) through various treatment and rehabilit",
    "description_ms": "Set data ini menyediakan maklumat mengenai penagih dadah yang dikategorikan mengikut tahap pendidikan tertinggi mereka. Data ini dikumpulkan oleh Agensi Anti Dadah Kebangsaan (AADK) melalui pelbagai p",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": "2015",
    "dataset_end": "2023",
    "data_source": [
      "AADK",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_addicts_education.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_addicts_education.csv",
    "last_updated": "2024-01-01 00:00:00.000 +08:00",
    "data_as_of": "2023-12-31 00:00:00.000 +08:00"
  },
  {
    "id": "drug_addicts_age",
    "title_en": "Drug Addicts by State & Age Group",
    "title_ms": "Penagih Dadah mengikut Negeri & Kumpulan Umur",
    "description_en": "This dataset provides yearly statistics on the number of drug addicts in Malaysia, broken down by state and age group. It offers insights into the demographic distribution of drug addiction across dif",
    "description_ms": "Set data ini menyediakan statistik tahunan mengenai bilangan penagih dadah di Malaysia, yang dipecahkan mengikut negeri dan kumpulan umur. Ia menawarkan pandangan tentang taburan demografi penagihan d",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "AGE"
    ],
    "dataset_begin": "2015",
    "dataset_end": "2023",
    "data_source": [
      "AADK",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_addicts_age.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_addicts_age.csv",
    "last_updated": "2023-12-31",
    "data_as_of": "2023"
  },
  {
    "id": "drug_addicts_drugtype",
    "title_en": "Drug Addicts by State & Drug Type",
    "title_ms": "Penagih Dadah mengikut Negeri & Jenis Dadah",
    "description_en": "This dataset provides information on the types of drugs reported by each state in Malaysia, as recorded by the National Anti-Drugs Agency (AADK). The data is categorized based on the type of drug as d",
    "description_ms": "Set data ini menyediakan maklumat mengenai jenis-jenis dadah yang dilaporkan oleh setiap negeri di Malaysia, seperti yang direkodkan oleh Agensi Anti Dadah Kebangsaan (AADK). Data dikategorikan berdas",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "NATIONALITY"
    ],
    "dataset_begin": "2015",
    "dataset_end": "2023",
    "data_source": [
      "AADK",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_addicts_drugtype.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_addicts_drugtype.csv",
    "last_updated": "2023-12-31 09:22:58.510 +08:00",
    "data_as_of": "2023-12-31 09:41:00.000 +08:00"
  },
  {
    "id": "drug_addicts_occupation",
    "title_en": "Drug Addicts by State & Occupation",
    "title_ms": "Penagih Dadah mengikut Negeri & Pekerjaan",
    "description_en": "This dataset managed by the National Anti-Drugs Agency (NADA) in collaboration with the Department of Statistics Malaysia (DOSM), provides annual statistics on drug addiction in Malaysia. It presents ",
    "description_ms": "Dataset ini diuruskan oleh Agensi Anti Dadah Kebangsaan (AADK) dengan kerjasama Jabatan Perangkaan Malaysia (DOSM), menyediakan statistik tahunan mengenai ketagihan dadah di Malaysia. Ia memaparkan da",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": "2016",
    "dataset_end": "2023",
    "data_source": [
      "AADK",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_addicts_occupation.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_addicts_occupation.csv",
    "last_updated": "2023-12-31",
    "data_as_of": "2023"
  },
  {
    "id": "drug_arrests_age",
    "title_en": "Drug Arrests by Sex & Age",
    "title_ms": "Tangkapan Dadah Mengikut Jantina & Umur",
    "description_en": "This dataset provides information on drug-related arrests categorized by sex and age group. It includes data on the type of arrest, whether for possession, supply, or positive urine tests, and is comp",
    "description_ms": "Set data ini menyediakan maklumat mengenai penangkapan berkaitan dadah yang dikategorikan mengikut jantina dan kumpulan umur. Ia merangkumi data mengenai jenis penangkapan, sama ada untuk pemilikan, p",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "AGE"
    ],
    "dataset_begin": "2019",
    "dataset_end": "2023",
    "data_source": [
      "PDRM",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_arrests_age.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_arrests_age.csv",
    "last_updated": "2023-12-31",
    "data_as_of": "2023"
  },
  {
    "id": "drug_arrests_ethnicity",
    "title_en": "Drug Arrests by Sex & Ethnicity",
    "title_ms": "Tangkapan Jenayah Dadah Mengikut Jantina & Etnik",
    "description_en": "This dataset provides information on drug-related arrests in Malaysia, categorized by sex and ethnicity. It includes annual data on various types of drug arrests, offering insights into demographic tr",
    "description_ms": "Dataset ini menyediakan maklumat mengenai tangkapan berkaitan dadah di Malaysia, dikategorikan mengikut jantina dan etnik. Ia merangkumi data tahunan mengenai pelbagai jenis penangkapan dadah, memberi",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX",
      "ETHNICITY"
    ],
    "dataset_begin": "2019",
    "dataset_end": "2023",
    "data_source": [
      "PDRM",
      "KDN"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Drug Addiction",
    "subcategory_ms": "Penagihan Dadah",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/drug_arrests_ethnicity.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/drug_arrests_ethnicity.csv",
    "last_updated": "2023-12-31",
    "data_as_of": "2023"
  },
  {
    "id": "legal_advisory_services",
    "title_en": "Legal Advisory Services",
    "title_ms": "Perkhidmatan Nasihat Undang-Undang",
    "description_en": "This data refers to the records of legal advice services that has been registered via the Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), handled by the Legal Aid Department (JBG). The numbers",
    "description_ms": "Data ini mengandungi rekod sesi nasihat undang-undang yang didaftarkan melalui Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), yang dikendalikan oleh Jabatan Bantuan Guaman (JBG). Ia merangkum",
    "frequency": "MONTHLY",
    "geography": [
      "STATE",
      "NATIONAL",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": "2021",
    "dataset_end": "2025",
    "data_source": [
      "JBG"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicadmin/legal_advisory_services.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/legal_advisory_services.csv",
    "last_updated": "2026-01-29 11:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "legal_advisory_branch",
    "title_en": "Legal Advisory Services by Branch",
    "title_ms": "Perkhidmatan Nasihat Undang-undang Mengikut Cawangan",
    "description_en": "This data refers to the records of legal advice services that has been registered via the Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), handled by the Legal Aid Department of Malaysia (JBG).",
    "description_ms": "Set data ini mengandungi rekod perkhidmatan nasihat undang-undang yang didaftarkan melalui Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), diuruskan oleh Jabatan Bantuan Guaman Malaysia (JBG).",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": "2021",
    "dataset_end": "2024",
    "data_source": [
      "JBG"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicadmin/legal_advisory_branch.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/legal_advisory_branch.csv",
    "last_updated": "2026-01-29 11:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "legal_advisory_category",
    "title_en": "Legal Advisory Services by Category",
    "title_ms": "Perkhidmatan Nasihat Undang-Undang Mengikut Kategori",
    "description_en": "This data refers to the records of legal advice services that has been registered via the Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), handled by the Legal Aid Department of Malaysia (JBG).",
    "description_ms": "Set data ini merekodkan perkhidmatan nasihat undang-undang yang didaftarkan melalui Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), yang dikendalikan oleh Jabatan Bantuan Guaman Malaysia (JBG)",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": "2021",
    "dataset_end": "2024",
    "data_source": [
      "JBG"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicadmin/legal_advisory_category.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/legal_advisory_category.csv",
    "last_updated": "2026-01-29 11:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "legal_advisory_subcategory",
    "title_en": "Legal Advisory Services by Subcategory",
    "title_ms": "Perkhidmatan Nasihat Undang-Undang Mengikut Sub Kategori",
    "description_en": "This data refers to the records of legal advice services that has been registered via the Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), handled by the Legal Aid Department of Malaysia (JBG).",
    "description_ms": "Dataset ini mengandungi rekod perkhidmatan nasihat undang-undang yang didaftarkan melalui Sistem Pengurusan Kes Jabatan Bantuan Guaman (SPK-JBG), yang diuruskan oleh Jabatan Bantuan Guaman Malaysia (J",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": "2021",
    "dataset_end": "2024",
    "data_source": [
      "JBG"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicadmin/legal_advisory_subcategory.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/legal_advisory_subcategory.csv",
    "last_updated": "2026-01-29 11:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "prisoners_prison",
    "title_en": "Prisoners by Prison Centre and Sex",
    "title_ms": "Banduan mengikut Penjara dan Jantina",
    "description_en": "Number of prisoners in Malaysia by prison centre and sex from 2017 to 2022.",
    "description_ms": "Bilangan banduan di Malaysia mengikut penjara dan jantina dari 2017 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "Penjara"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/prisoners_prison.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/prisoners_prison.csv",
    "last_updated": "2023-12-31 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "prisoners_state",
    "title_en": "Prisoners by State and Sex",
    "title_ms": "Banduan mengikut Negeri dan Jantina",
    "description_en": "Number of prisoners in Malaysia by state and sex from 2017 to 2022.",
    "description_ms": "Bilangan banduan di Malaysia mengikut negeri dan jantina dari 2017 hingga 2022.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "Penjara"
    ],
    "category_en": "Public Safety",
    "category_ms": "Keselamatan Awam",
    "subcategory_en": "Justice",
    "subcategory_ms": "Keadilan",
    "category_sort": 42,
    "link_parquet": "https://storage.data.gov.my/publicsafety/prisoners_state.parquet",
    "link_csv": "https://storage.data.gov.my/publicsafety/prisoners_state.csv",
    "last_updated": "2023-12-31 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "epf_dividend",
    "title_en": "Annual EPF Dividend",
    "title_ms": "Dividen KWSP Tahunan",
    "description_en": "Annual dividend rates declared by the EPF for conventional and Shariah-compliant investments.",
    "description_ms": "Kadar dividen tahunan yang diisytiharkan oleh EPF bagi pelaburan konvensional serta patuh Syariah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1952,
    "dataset_end": 2025,
    "data_source": [
      "EPF"
    ],
    "category_en": "Public Welfare",
    "category_ms": "Kebajikan Awam",
    "subcategory_en": "Retirement",
    "subcategory_ms": "Persaraan",
    "category_sort": 43,
    "link_parquet": "https://storage.data.gov.my/welfare/epf_dividend.parquet",
    "link_csv": "https://storage.data.gov.my/welfare/epf_dividend.csv",
    "last_updated": "2026-02-28 18:00",
    "data_as_of": "2025"
  },
  {
    "id": "water_access",
    "title_en": "Access to Treated Water by State & Strata",
    "title_ms": "Akses ke Air Dirawat Mengikut Negeri & Strata",
    "description_en": "Annual access of households to treated piped water by state and strata.",
    "description_ms": "Akses isi rumah kepada sumber air paip dirawat mengikut negeri dan strata.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2022,
    "data_source": [
      "SPAN",
      "NRES"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Water",
    "subcategory_ms": "Air",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/water/water_access.parquet",
    "link_csv": "https://storage.data.gov.my/water/water_access.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "forest_reserve",
    "title_en": "Area of Permanent Forest Reserves",
    "title_ms": "Keluasan Hutan Simpan Kekal",
    "description_en": "The area of permanent forest reserves as of year-end.",
    "description_ms": "Keluasan tahunan hutan simpan setakat hujung tahun.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2021,
    "data_source": [
      "Perhutanan",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Land Use",
    "subcategory_ms": "Penggunaan Tanah",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/environment/forest_reserve.parquet",
    "link_csv": "https://storage.data.gov.my/environment/forest_reserve.csv",
    "last_updated": "2024-08-13 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "forest_reserve_state",
    "title_en": "Area of Permanent Forest Reserves by State",
    "title_ms": "Keluasan Hutan Simpan Kekal mengikut Negeri",
    "description_en": "The area of permanent forest reserves as of year-end, by state.",
    "description_ms": "Keluasan tahunan hutan simpan setakat hujung tahun, mengikut negeri.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2021,
    "data_source": [
      "Perhutanan",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Land Use",
    "subcategory_ms": "Penggunaan Tanah",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/environment/forest_reserve_state.parquet",
    "link_csv": "https://storage.data.gov.my/environment/forest_reserve_state.csv",
    "last_updated": "2024-08-13 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "electricity_supply",
    "title_en": "Electricity Supply",
    "title_ms": "Bekalan Elektrik",
    "description_en": "Monthly electricity supply by sector.",
    "description_ms": "Bekalan elektrik bulanan mengikut sektor.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2024,
    "data_source": [
      "TNB",
      "SESB",
      "SWK-ENERGY",
      "ST",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Energy",
    "subcategory_ms": "Tenaga",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/energy/electricity_supply.parquet",
    "link_csv": "https://storage.data.gov.my/energy/electricity_supply.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2024-09-30 23:59"
  },
  {
    "id": "ghg_emissions",
    "title_en": "Greenhouse Gas Emissions",
    "title_ms": "Pelepasan Gas Rumah Hijau",
    "description_en": "Annual greenhouse gas (GHG) emissions by source.",
    "description_ms": "Pelepasan gas rumah hijau (GHG) tahunan mengikut sumber.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2014,
    "dataset_end": 2021,
    "data_source": [
      "NRES",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Pollution",
    "subcategory_ms": "Pencemaran",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/environment/ghg_emissions.parquet",
    "link_csv": "https://storage.data.gov.my/environment/ghg_emissions.csv",
    "last_updated": "2024-09-01",
    "data_as_of": "2021"
  },
  {
    "id": "electricity_access",
    "title_en": "Households with Access to Electricity",
    "title_ms": "Isi Rumah dengan Akses ke Bekalan Elektrik",
    "description_en": "Number of households with access to electricity at home.",
    "description_ms": "Bilangan isi rumah yang mempunyai akses kepada bekalan elektrik di rumah.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2011,
    "dataset_end": 2021,
    "data_source": [
      "TNB",
      "SESB",
      "SWK-ENERGY",
      "ST"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Energy",
    "subcategory_ms": "Tenaga",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/energy/electricity_access.parquet",
    "link_csv": "https://storage.data.gov.my/energy/electricity_access.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "air_pollution",
    "title_en": "Monthly Air Pollution",
    "title_ms": "Pencemaran Udara Bulanan",
    "description_en": "Average monthly concentration of key air pollutants.",
    "description_ms": "Kepekatan purata bulanan bahan pencemar udara utama.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "JAS",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Pollution",
    "subcategory_ms": "Pencemaran",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/environment/air_pollution.parquet",
    "link_csv": "https://storage.data.gov.my/environment/air_pollution.csv",
    "last_updated": "2023-11-27 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "electricity_consumption",
    "title_en": "Monthly Electricity Consumption",
    "title_ms": "Penggunaan Elektrik Bulanan",
    "description_en": "Monthly electricity consumption by sector.",
    "description_ms": "Penggunaan elektrik bulanan mengikut sektor.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2024,
    "data_source": [
      "TNB",
      "SESB",
      "SWK-ENERGY",
      "ST",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Energy",
    "subcategory_ms": "Tenaga",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/energy/electricity_consumption.parquet",
    "link_csv": "https://storage.data.gov.my/energy/electricity_consumption.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2024-09-30 23:59"
  },
  {
    "id": "water_pollution_basin",
    "title_en": "River Basin Pollution Monitoring",
    "title_ms": "Pemantauan Pencemaran Lembangan Sungai",
    "description_en": "Proportion of river basins classified as clean, slightly polluted, or polluted based on 3 primary indicators of water pollution.",
    "description_ms": "Nisbah lembangan sungai yang dikelaskan sebagai bersih, tercemar sedikit, atau tercemar berdasarkan 3 indikator utama pencemaran air.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2021,
    "data_source": [
      "JAS"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Pollution",
    "subcategory_ms": "Pencemaran",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/environment/water_pollution_basin.parquet",
    "link_csv": "https://storage.data.gov.my/environment/water_pollution_basin.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "water_consumption",
    "title_en": "Water Consumption by State and Sector",
    "title_ms": "Penggunaan Air Mengikut Negeri dan Sektor",
    "description_en": "Annual water consumption by state, broken down into domestic and non-domestic sectors.",
    "description_ms": "Penggunaan air tahunan mengikut negeri, dengan pecahan kepada sektor domestik dan bukan domestik.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2022,
    "data_source": [
      "SPAN",
      "NRES",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Water",
    "subcategory_ms": "Air",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/water/water_consumption.parquet",
    "link_csv": "https://storage.data.gov.my/water/water_consumption.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "water_production",
    "title_en": "Water Production by State",
    "title_ms": "Pengeluaran Air Mengikut Negeri",
    "description_en": "Annual water production by state.",
    "description_ms": "Pengeluaran air tahunan mengikut negeri.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2022,
    "data_source": [
      "SPAN",
      "NRES",
      "DOSM"
    ],
    "category_en": "Environment",
    "category_ms": "Alam Sekitar",
    "subcategory_en": "Water",
    "subcategory_ms": "Air",
    "category_sort": 45,
    "link_parquet": "https://storage.data.gov.my/water/water_production.parquet",
    "link_csv": "https://storage.data.gov.my/water/water_production.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022-12-31 23:59"
  },
  {
    "id": "cellular_subscribers",
    "title_en": "Cellular Subscribers by Plan Type",
    "title_ms": "Pelanggan Selular Mengikut Jenis Pelan",
    "description_en": "Annual data on the number of postpaid and prepaid cellular subscribers in Malaysia.",
    "description_ms": "Data tahunan mengenai bilangan pelanggan selular pascabayar dan prabayar di Malaysia.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2021,
    "data_source": [
      "MCMC"
    ],
    "category_en": "Communications",
    "category_ms": "Komunikasi",
    "subcategory_en": "Telecommunications",
    "subcategory_ms": "Telekomunikasi",
    "category_sort": 48,
    "link_parquet": "https://storage.data.gov.my/communications/cellular_subscribers.parquet",
    "link_csv": "https://storage.data.gov.my/communications/cellular_subscribers.csv",
    "last_updated": "2024-11-26 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "lfs_year",
    "title_en": "Annual Principal Labour Force Statistics",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama",
    "description_en": "Annual principal labour force statistics, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1982,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_year.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_year.csv",
    "last_updated": "2024-02-09 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "lfs_district",
    "title_en": "Annual Principal Labour Force Statistics by District",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama mengikut Daerah",
    "description_en": "Annual principal labour force statistics at district level, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh di peringkat daerah pentadbiran, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "STATE",
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_district.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_district.csv",
    "last_updated": "2024-02-09 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "lfs_dun",
    "title_en": "Annual Principal Labour Force Statistics by DUN",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama mengikut DUN",
    "description_en": "Annual principal labour force statistics at DUN constituency level, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh di peringkat kawasan DUN, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "DUN"
    ],
    "demography": [],
    "dataset_begin": 2021,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_dun.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_dun.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "lfs_parlimen",
    "title_en": "Annual Principal Labour Force Statistics by Parliament",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama mengikut Parlimen",
    "description_en": "Annual principal labour force statistics at Parliament constituency level, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh di peringkat kawasan Parlimen, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "PARLIMEN"
    ],
    "demography": [],
    "dataset_begin": 2021,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_parlimen.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_parlimen.csv",
    "last_updated": "2025-12-31 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "lfs_year_sex",
    "title_en": "Annual Principal Labour Force Statistics by Sex",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama mengikut Jantina",
    "description_en": "Annual principal labour force statistics by sex, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh mengikut jantina, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1982,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_year_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_year_sex.csv",
    "last_updated": "2024-07-30 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "lfs_state_sex",
    "title_en": "Annual Principal Labour Force Statistics by State & Sex",
    "title_ms": "Statistik Tenaga Buruh Tahunan Utama mengikut Negeri & Jantina",
    "description_en": "Annual principal labour force statistics at state level by sex, including unemployment and participation rates.",
    "description_ms": "Statistik tahunan utama berkaitan tenaga buruh di peringkat negeri mengikut jantina, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "YEARLY",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 1982,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_state_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_state_sex.csv",
    "last_updated": "2024-07-30 12:00",
    "data_as_of": "2023"
  },
  {
    "id": "productivity_annual",
    "title_en": "Annual Productivity by Economic Sector",
    "title_ms": "Produktiviti Tahunan mengikut Sektor Ekonomi",
    "description_en": "Annual labour productivity by economic sector, with metrics on value added per worker, value added per hour worked, and total hours worked.",
    "description_ms": "Produktiviti tenaga buruh tahunanmengikut sektor ekonomi, dengan metrik pada nilai tambah per pekerja, nilai tambah per jam bekerja, dan jumlah jam bekerja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Productivity",
    "subcategory_ms": "Produktiviti Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/productivity_annual.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/productivity_annual.csv",
    "last_updated": "2026-02-23 12:30",
    "data_as_of": "2025"
  },
  {
    "id": "productivity_annual_priority",
    "title_en": "Annual Productivity for Priority Subsectors",
    "title_ms": "Produktiviti Tahunan untuk Subsektor Penting",
    "description_en": "Annual labour productivity for 14 priority subsectors, with metrics on value added per worker, value added per hour worked, and total hours worked.",
    "description_ms": "Produktiviti tenaga buruh tahunan bagi 14 subsektor penting, dengan metrik pada nilai tambah per pekerja, nilai tambah per jam bekerja, dan jumlah jam bekerja.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Productivity",
    "subcategory_ms": "Produktiviti Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/productivity_annual_p14.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/productivity_annual_p14.csv",
    "last_updated": "2026-02-23 12:30",
    "data_as_of": "2025"
  },
  {
    "id": "employment_sector",
    "title_en": "Employment by MSIC Sector and Sex",
    "title_ms": "Pekerjaan Mengikut Sektor MSIC dan Jantina",
    "description_en": "Annual distribution of employment by MSIC sector and sex.",
    "description_ms": "Taburan pekerjaan tahunan mengikut sektor MSIC dan jantina.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2001,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/employment_sector.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/employment_sector.csv",
    "last_updated": "2024-11-08 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "productivity_lookup",
    "title_en": "Lookup Table: Labour Productivity",
    "title_ms": "Jadual Carian: Produktiviti Tenaga Buruh",
    "description_en": "Lookup table, to be left-joined against other productivity datasets if specified.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan set data produktiviti lain sekiranya diperlukan.",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Productivity",
    "subcategory_ms": "Produktiviti Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/productivity_lookup.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/productivity_lookup.csv",
    "last_updated": "2026-02-23 12:30",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "lfs_month_status",
    "title_en": "Monthly Employment by Status in Employment",
    "title_ms": "Guna Tenaga Bulanan mengikut Taraf Pekerjaan",
    "description_en": "Breakdown of employment into employers, employees, own-account workers and unpaid family workers.",
    "description_ms": "Pecahan guna tenaga kepada majikan, pekerja, bekerja sendiri dan pekerja keluarga tanpa gaji.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_month_status.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_month_status.csv",
    "last_updated": "2026-05-12 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "lfs_month",
    "title_en": "Monthly Principal Labour Force Statistics",
    "title_ms": "Statistik Tenaga Buruh Bulanan Utama",
    "description_en": "Monthly principal labour force statistics, including unemployment and participation rates.",
    "description_ms": "Statistik bulanan utama berkaitan tenaga buruh termasuk guna tenaga, pengangguran dan penyertaan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_month.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_month.csv",
    "last_updated": "2026-05-12 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "lfs_month_sa",
    "title_en": "Monthly Principal Labour Force Statistics, Seasonally Adjusted",
    "title_ms": "Statistik Tenaga Buruh Bulanan Utama, Terlaras secara Bermusim",
    "description_en": "Seasonally adjusted monthly principal labour force statistics, including unemployment and participation rates.",
    "description_ms": "Statistik bulanan utama berkaitan tenaga buruh yang terlaras secara bermusim, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_month_sa.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_month_sa.csv",
    "last_updated": "2026-05-12 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "lfs_month_duration",
    "title_en": "Monthly Unemployment by Duration",
    "title_ms": "Pengangguran Bulanan mengikut Tempoh",
    "description_en": "Breakdown of monthly unemployed figures by duration of unemployment.",
    "description_ms": "Pecahan angka penganggurann bulanan mengikut tempoh pengangguran.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_month_duration.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_month_duration.csv",
    "last_updated": "2026-05-12 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "lfs_month_youth",
    "title_en": "Monthly Youth Unemployment",
    "title_ms": "Pengangguran Belia Bulanan",
    "description_en": "Monthly unemployment statistics focusing on the 15-30 age group.",
    "description_ms": "Statistik pengangguran bulanan dengan fokus pada kumpulan umur 15-30.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_month_youth.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_month_youth.csv",
    "last_updated": "2026-05-12 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "lfs_qtr",
    "title_en": "Quarterly Principal Labour Force Statistics",
    "title_ms": "Statistik Tenaga Buruh Suku Tahunan Utama",
    "description_en": "Quarterly principal labour force statistics, including unemployment and participation rates.",
    "description_ms": "Statistik suku tahunan utama berkaitan tenaga buruh, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "lfs_qtr_state",
    "title_en": "Quarterly Principal Labour Force Statistics by State",
    "title_ms": "Statistik Tenaga Buruh Suku Tahunan Utama mengikut Negeri",
    "description_en": "Quarterly principal labour force statistics by state, including unemployment and participation rates.",
    "description_ms": "Statistik suku tahunan utama berkaitan tenaga buruh mengikut negeri, termasuk kadar pengangguran dan penyertaan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr_state.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "productivity_qtr",
    "title_en": "Quarterly Productivity by Economic Sector",
    "title_ms": "Produktiviti Suku Tahunan mengikut Sektor Ekonomi",
    "description_en": "Quarterly labour productivity by economic sector, with metrics on value added per worker, value added per hour worked, and total hours worked.",
    "description_ms": "Produktiviti tenaga buruh suku tahunan mengikut sektor ekonomi, dengan metrik pada nilai tambah per pekerja, nilai tambah per jam bekerja, dan jumlah jam bekerja.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Productivity",
    "subcategory_ms": "Produktiviti Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/productivity_qtr.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/productivity_qtr.csv",
    "last_updated": "2026-02-23 12:30",
    "data_as_of": "2025-Q4"
  },
  {
    "id": "lfs_qtr_sru_age",
    "title_en": "Quarterly Skills-Related Underemployment by Age",
    "title_ms": "Guna Tenaga Tidak Penuh Berkaitan Kemahiran Suku Tahunan mengikut Umur",
    "description_en": "Number and proportion of working individuals with tertiary education working in a semi-skilled or low-skilled job, broken down by age group.",
    "description_ms": "Jumlah dan nisbah individu bekerja yang mempunyai pendidikan tertiari tetapi bekerja dalam kategori separuh mahir dan berkemahiran rendah, dengan pecahan mengikut kumpulan umur.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr_sru_age.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr_sru_age.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "lfs_qtr_sru_sex",
    "title_en": "Quarterly Skills-Related Underemployment by Sex",
    "title_ms": "Guna Tenaga Tidak Penuh Berkaitan Kemahiran Suku Tahunan mengikut Jantina",
    "description_en": "Number and proportion of working individuals with tertiary education working in a semi-skilled or low-skilled job, broken down by sex.",
    "description_ms": "Jumlah dan nisbah individu bekerja yang mempunyai pendidikan tertiari tetapi bekerja dalam kategori separuh mahir dan berkemahiran rendah, dengan pecahan mengikut jantina.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr_sru_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr_sru_sex.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "lfs_qtr_tru_age",
    "title_en": "Quarterly Time-Related Underemployment by Age",
    "title_ms": "Guna Tenaga Tidak Penuh Berkaitan Masa Suku Tahunan mengikut Umur",
    "description_en": "Number and proportion of working individuals who worked less than 30 hours per week even though they were willing to work more, i.e. due to unavailability of work.",
    "description_ms": "Jumlah dan nisbah individu bekerja yang bekerja kurang daripada 30 jam walaupun mereka sudi bekerja lebih, iaitu disebabkan keadaan kerja yang tidak mencukupi.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr_tru_age.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr_tru_age.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "lfs_qtr_tru_sex",
    "title_en": "Quarterly Time-Related Underemployment by Sex",
    "title_ms": "Guna Tenaga Tidak Penuh Berkaitan Masa Suku Tahunan mengikut Jantina",
    "description_en": "Number and proportion of working individuals who worked less than 30 hours per week even though they were willing to work more, i.e. due to unavailability of work.",
    "description_ms": "Jumlah dan nisbah individu bekerja yang bekerja kurang daripada 30 jam walaupun mereka sudi bekerja lebih, iaitu disebabkan keadaan kerja yang tidak mencukupi.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Labour Markets",
    "category_ms": "Pasaran Buruh",
    "subcategory_en": "Labour Force Survey",
    "subcategory_ms": "Survei Tenaga Buruh",
    "category_sort": 50,
    "link_parquet": "https://storage.dosm.gov.my/labour/lfs_qtr_tru_sex.parquet",
    "link_csv": "https://storage.dosm.gov.my/labour/lfs_qtr_tru_sex.csv",
    "last_updated": "2025-11-10 12:00",
    "data_as_of": "2025-Q3"
  },
  {
    "id": "currency_in_circulation_annual",
    "title_en": "Annual Currency in Circulation",
    "title_ms": "Mata Wang dalam Edaran Tahunan",
    "description_en": "The value of currency in circulation by denomination, for instance RM 1, RM 5, RM 10.",
    "description_ms": "Nilai mata wang dalam edaran mengikut denominasi, contohnya bagi nota RM1, RM5 dan RM10.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1975,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Money Supply",
    "subcategory_ms": "Penawaran Wang",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/currency_in_circulation_annual.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/currency_in_circulation_annual.csv",
    "last_updated": "2026-01-31 15:00",
    "data_as_of": "2025"
  },
  {
    "id": "interestrates_annual",
    "title_en": "Annual Interest Rates",
    "title_ms": "Kadar Faedah Tahunan",
    "description_en": "Various interest rates monitored by Bank Negara Malaysia, such as fixed deposit rates, base rates, and lending rates.",
    "description_ms": "Kadar faedah yang dipantau oleh Bank Negara Malaysia, seperti kadar deposit tetap, kadar asas, dan kadar pinjaman.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1980,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Banking System",
    "subcategory_ms": "Sistem Perbankan",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/interest_rates_annual.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/interest_rates_annual.csv",
    "last_updated": "2026-01-31 15:00",
    "data_as_of": "2025"
  },
  {
    "id": "trnsc_daily_directdebit",
    "title_en": "Daily DirectDebit Transactions",
    "title_ms": "Transaksi DirectDebit Harian",
    "description_en": "Daily volume and value of DirectDebit transactions.",
    "description_ms": "Jumlah dan nilai transaksi DirectDebit harian.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2026,
    "data_source": [
      "PayNet",
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/trnsc_daily_directdebit.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/trnsc_daily_directdebit.csv",
    "last_updated": "2026-05-16 07:30",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "exchangerates_daily_0900",
    "title_en": "Daily Exchange Rates (0900)",
    "title_ms": "Kadar Pertukaran Wang Asing Harian (0900)",
    "description_en": "Daily rates of exchange of the Malaysian ringgit vis-à-vis selected currencies at 0900, acting as a start-of-day reference. The table and charts provide a preview using the latest 1 year of data, but ",
    "description_ms": "Kadar pertukaran ringgit Malaysia berbanding mata wang asing terpilih pada 0900, sebagai rujukan permulaan hari. Jadual dan carta memberikan pratonton menggunakan data bagi 1 tahun terkini, tetapi and",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Foreign Exchange",
    "subcategory_ms": "Pertukaran Asing (FX)",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/daily_0900.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/exr/daily_0900.csv",
    "last_updated": "2026-05-15 09:30",
    "data_as_of": "2026-05-15 09:00"
  },
  {
    "id": "exchangerates_daily_1130",
    "title_en": "Daily Exchange Rates (1130)",
    "title_ms": "Kadar Pertukaran Wang Asing Harian (1130)",
    "description_en": "Daily rates of exchange of the Malaysian ringgit vis-à-vis selected currencies at 1130, which are the best counter rates offered by selected commercial banks. The table and charts provide a preview us",
    "description_ms": "Kadar pertukaran ringgit Malaysia berbanding mata wang asing terpilih pada 1130, iaitu kadar terbaik yang ditawarkan oleh bank komersial terpilih. Jadual dan carta memberikan pratonton menggunakan dat",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Foreign Exchange",
    "subcategory_ms": "Pertukaran Asing (FX)",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/daily_1130.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/exr/daily_1130.csv",
    "last_updated": "2026-05-15 12:10",
    "data_as_of": "2026-05-15 11:30"
  },
  {
    "id": "exchangerates_daily_1200",
    "title_en": "Daily Exchange Rates (1200)",
    "title_ms": "Kadar Pertukaran Wang Asing Harian (1200)",
    "description_en": "Daily rates of exchange of the Malaysian ringgit vis-à-vis selected currencies at 1200, acting as a mid-day reference. The table and charts provide a preview using the latest 1 year of data, but you m",
    "description_ms": "Kadar pertukaran ringgit Malaysia berbanding mata wang asing terpilih pada 1200, sebagai rujukan pertengahan hari. Jadual dan carta memberikan pratonton menggunakan data bagi 1 tahun terkini, tetapi a",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1997,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Foreign Exchange",
    "subcategory_ms": "Pertukaran Asing (FX)",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/daily_1200.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/exr/daily_1200.csv",
    "last_updated": "2026-05-15 12:30",
    "data_as_of": "2026-05-15 12:00"
  },
  {
    "id": "exchangerates_daily_1700",
    "title_en": "Daily Exchange Rates (1700)",
    "title_ms": "Kadar Pertukaran Wang Asing Harian (1700)",
    "description_en": "Daily rates of exchange of the Malaysian ringgit vis-à-vis selected currencies at 1700, acting as a end-of-day reference. The table and charts provide a preview using the latest 1 year of data, but yo",
    "description_ms": "Kadar pertukaran ringgit Malaysia berbanding mata wang asing terpilih pada 1700, sebagai rujukan pada akhir hari. Jadual dan carta memberikan pratonton menggunakan data bagi 1 tahun terkini, tetapi an",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2003,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Foreign Exchange",
    "subcategory_ms": "Pertukaran Asing (FX)",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/daily_1700.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/exr/daily_1700.csv",
    "last_updated": "2026-05-15 17:30",
    "data_as_of": "2026-05-15 17:00"
  },
  {
    "id": "trnsc_daily_fpx",
    "title_en": "Daily FPX Transactions",
    "title_ms": "Transaksi FPX Harian",
    "description_en": "Daily volume and value of FPX transactions by business model.",
    "description_ms": "Jumlah dan nilai transaksi FPX harian mengikut model perniagaan.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2026,
    "data_source": [
      "PayNet",
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/trnsc_daily_fpx.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/trnsc_daily_fpx.csv",
    "last_updated": "2026-05-16 07:30",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "trnsc_daily_jompay",
    "title_en": "Daily JomPAY Transactions",
    "title_ms": "Transaksi JomPAY Harian",
    "description_en": "Daily volume and value of JomPAY transactions.",
    "description_ms": "Jumlah dan nilai transaksi JomPAY harian.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2026,
    "data_source": [
      "PayNet",
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/trnsc_daily_jompay.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/trnsc_daily_jompay.csv",
    "last_updated": "2026-05-16 07:30",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "trnsc_daily_san",
    "title_en": "Daily Shared ATM Network (SAN) Transactions",
    "title_ms": "Transaksi Rangkaian ATM Kongsi (SAN) Harian",
    "description_en": "Daily volume and value of Shared ATM Network (SAN) transactions by geographic segment.",
    "description_ms": "Jumlah dan nilai transaksi Rangkaian ATM Kongi (SAN) harian mengikut segmen geografi.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2020,
    "dataset_end": 2026,
    "data_source": [
      "PayNet",
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/trnsc_daily_san.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/trnsc_daily_san.csv",
    "last_updated": "2026-05-16 07:30",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "monetary_aggregates",
    "title_en": "Monetary Aggregates: M1, M2, M3",
    "title_ms": "Agregat Kewangan: M1, M2, M3",
    "description_en": "The total value of the money supply, as measured by M1, M2, and M3.",
    "description_ms": "Jumlah nilai penawaran wang, seperti mana yang diukur dengan menggunakan M1, M2, dan M3.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2013,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Money Supply",
    "subcategory_ms": "Penawaran Wang",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/money_aggregates.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/money_aggregates.csv",
    "last_updated": "2026-01-31 18:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "currency_in_circulation",
    "title_en": "Monthly Currency in Circulation",
    "title_ms": "Mata Wang dalam Edaran Bulanan",
    "description_en": "The value of currency in circulation by denomination, for instance RM 1, RM 5, RM 10.",
    "description_ms": "Nilai mata wang dalam edaran mengikut denominasi, contohnya bagi nota RM1, RM5 dan RM10.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Money Supply",
    "subcategory_ms": "Penawaran Wang",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/currency_in_circulation.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/currency_in_circulation.csv",
    "last_updated": "2026-01-31 18:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "exchangerates",
    "title_en": "Monthly Exchange Rates",
    "title_ms": "Kadar Pertukaran Wang Asing Bulanan",
    "description_en": "Monthly rates of exchange of the Malaysian ringgit vis-à-vis selected currencies.",
    "description_ms": "Kadar pertukaran ringgit Malaysia berbanding mata wang asing terpilih.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1997,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Foreign Exchange",
    "subcategory_ms": "Pertukaran Asing (FX)",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/monthly.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/exr/monthly.csv",
    "last_updated": "2026-04-30 12:30",
    "data_as_of": "2026-04-30 12:00"
  },
  {
    "id": "interestrates",
    "title_en": "Monthly Interest Rates",
    "title_ms": "Kadar Faedah Bulanan",
    "description_en": "Various interest rates monitored by Bank Negara Malaysia, such as fixed deposit rates, base rates, and lending rates.",
    "description_ms": "Kadar faedah yang dipantau oleh Bank Negara Malaysia, seperti kadar deposit tetap, kadar asas, dan kadar pinjaman.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1997,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Banking System",
    "subcategory_ms": "Sistem Perbankan",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/interest_rates.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/interest_rates.csv",
    "last_updated": "2026-01-31 18:00",
    "data_as_of": "2025-12"
  },
  {
    "id": "payment_channels",
    "title_en": "Monthly Usage of Payment Channels",
    "title_ms": "Penggunaan Saluran Pembayaran Bulanan",
    "description_en": "Monthly volume and value of transactions, disaggregated by payment channel.",
    "description_ms": "Jumlah dan nilai transaksi, diselaraskan mengikut saluran pembayaran.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/channels.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/channels.csv",
    "last_updated": "2026-04-06 15:00",
    "data_as_of": "2026-02"
  },
  {
    "id": "payment_instruments",
    "title_en": "Monthly Usage of Payment Instruments",
    "title_ms": "Penggunaan Instrumen Pembayaran Bulanan",
    "description_en": "Monthly volume and value of transactions, disaggregated by payment instrument.",
    "description_ms": "Jumlah dan nilai transaksi, diselaraskan mengikut instrumen pembayaran.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/instruments.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/instruments.csv",
    "last_updated": "2026-04-06 15:00",
    "data_as_of": "2026-02"
  },
  {
    "id": "payment_systems",
    "title_en": "Monthly Usage of Payment Systems",
    "title_ms": "Penggunaan Sistem Pembayaran Bulanan",
    "description_en": "Monthly volume and value of transactions, disaggregated by payment system.",
    "description_ms": "Jumlah dan nilai transaksi, diselaraskan mengikut sistem pembayaran.",
    "frequency": "DAILY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2019,
    "dataset_end": 2026,
    "data_source": [
      "BNM"
    ],
    "category_en": "Financial Markets",
    "category_ms": "Pasaran Kewangan",
    "subcategory_en": "Payments",
    "subcategory_ms": "Pembayaran",
    "category_sort": 60,
    "link_parquet": "https://storage.data.gov.my/finsector/payments/systems.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/payments/systems.csv",
    "last_updated": "2026-04-06 15:00",
    "data_as_of": "2026-02"
  },
  {
    "id": "cpi_annual",
    "title_en": "Annual CPI by Division (2-digit)",
    "title_ms": "IHP Tahunan mengikut Bahagian (2-digit)",
    "description_en": "National-level CPI for 13 main groups of goods and services, from 1960 to the present day.",
    "description_ms": "IHP peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan, dari 1960 sehingga kini.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1960,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_annual.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_annual.csv",
    "last_updated": "2026-01-22 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "cpi_annual_inflation",
    "title_en": "Annual CPI Inflation by Division (2-digit)",
    "title_ms": "Inflasi IHP Tahunan mengikut Bahagian (2-digit)",
    "description_en": "National-level CPI inflation for 13 main groups of goods and services, from 1961 to the present.",
    "description_ms": "Inflasi IHP peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan, dari 1961 sehingga kini.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1961,
    "dataset_end": 2025,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_annual_inflation.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_annual_inflation.csv",
    "last_updated": "2026-01-22 12:00",
    "data_as_of": "2025"
  },
  {
    "id": "sppi",
    "title_en": "Headline Services Producer Price Index (SPPI)",
    "title_ms": "Indeks Harga Pengeluar Perkhidmatan (IHPRP) Keseluruhan",
    "description_en": "Headline services producer price index (SPPI), covering 8 key services sub-sectors.",
    "description_ms": "Indeks harga pengeluar perkhidmatan (IHPRP), meliputi 8 sub-sektor perkhidmatan penting.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/sppi.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/sppi.csv",
    "last_updated": "2026-05-07 12:30",
    "data_as_of": "2026-Q1"
  },
  {
    "id": "cpi_core",
    "title_en": "Monthly Core CPI by Division (2-digit)",
    "title_ms": "IHP Teras Bulanan mengikut Bahagian (2-digit)",
    "description_en": "National-level core CPI for 13 main groups of goods and services.",
    "description_ms": "IHP teras peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_core.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_core.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_core_inflation",
    "title_en": "Monthly Core CPI Inflation by Division (2-digit)",
    "title_ms": "Inflasi IHP Teras Bulanan mengikut Bahagian (2-digit)",
    "description_en": "National-level core CPI inflation for 13 main groups of goods and services.",
    "description_ms": "Inflasi IHP teras peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_core_inflation.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_core_inflation.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_4d",
    "title_en": "Monthly CPI by Class (4-digit)",
    "title_ms": "IHP Bulanan mengikut Kelas (4-digit)",
    "description_en": "National-level CPI at class granularity. The table below provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "IHP peringkat nasional dengan perincian tahap kelas. Jadual di bawah memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_4d.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_4d.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_headline",
    "title_en": "Monthly CPI by Division (2-digit)",
    "title_ms": "IHP Bulanan mengikut Bahagian (2-digit)",
    "description_en": "National-level CPI for 13 main groups of goods and services.",
    "description_ms": "IHP peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_3d",
    "title_en": "Monthly CPI by Group (3-digit)",
    "title_ms": "IHP Bulanan mengikut Kumpulan (3-digit)",
    "description_en": "National-level CPI at group granularity. The table below provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "IHP peringkat nasional dengan perincian tahap kumpulan. Jadual di bawah memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_3d.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_3d.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_state",
    "title_en": "Monthly CPI by State & Division (2-digit)",
    "title_ms": "IHP Bulanan mengikut Negeri & Bahagian (2-digit)",
    "description_en": "State-level CPI for 13 main groups of goods and services.",
    "description_ms": "IHP peringkat negeri bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_state.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_state.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_strata",
    "title_en": "Monthly CPI by Strata & Division (2-digit)",
    "title_ms": "IHP Bulanan mengikut Strata & Bahagian (2-digit)",
    "description_en": "CPI by strata (urban/rural) for 13 main groups of goods and services.",
    "description_ms": "IHP mengikut strata (bandar/luar bandar) bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_strata.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_strata.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_5d",
    "title_en": "Monthly CPI by Subclass (5-digit)",
    "title_ms": "IHP Bulanan mengikut Subkelas (5-digit)",
    "description_en": "National-level CPI at subclass granularity. The table below provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "IHP peringkat nasional dengan perincian tahap subkelas. Jadual di bawah memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_5d.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_5d.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_lowincome",
    "title_en": "Monthly CPI for Low-Income Households",
    "title_ms": "IHP Bulanan bagi Isi Rumah Berpendapatan Rendah",
    "description_en": "National-level CPI for low-income households (< RM3000 per month) across 13 main groups of goods and services.",
    "description_ms": "IHP peringkat nasional bagi isi rumah berpendapatan rendah (< RM3000 sebulan) meliputi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_lowincome.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_lowincome.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_headline_inflation",
    "title_en": "Monthly CPI Inflation by Division (2-digit)",
    "title_ms": "Inflasi IHP Bulanan mengikut Bahagian (2-digit)",
    "description_en": "National-level CPI inflation for 13 main groups of goods and services",
    "description_ms": "Inflasi IHP peringkat nasional bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2001,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_inflation.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_inflation.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "cpi_state_inflation",
    "title_en": "Monthly CPI Inflation by State & Division (2-digit)",
    "title_ms": "Inflasi IHP Bulanan mengikut Negeri & Bahagian (2-digit)",
    "description_en": "State-level CPI inflation for 13 main groups of goods and services",
    "description_ms": "Inflasi IHP peringkat negeri bagi 13 kumpulan utama barangan dan perkhidmatan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/cpi/cpi_2d_state_inflation.parquet",
    "link_csv": "https://storage.dosm.gov.my/cpi/cpi_2d_state_inflation.csv",
    "last_updated": "2026-05-15 12:22",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi_2d",
    "title_en": "Monthly PPI by Division (2 digit)",
    "title_ms": "IHPR Bulanan mengikut Bahagian (2 digit)",
    "description_en": "Monthly producer price index (PPI) by MSIC division (2 digit). The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan mengikut bahagian MSIC (2 digit). Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi_2d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi_2d.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi_3d",
    "title_en": "Monthly PPI by Group (3 digit)",
    "title_ms": "IHPR Bulanan mengikut Kumpulan (3 digit)",
    "description_en": "Monthly producer price index (PPI) by MSIC group (3 digit). The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan mengikut kumpulan MSIC (3 digit). Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi_3d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi_3d.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi_1d",
    "title_en": "Monthly PPI by Section (1 digit)",
    "title_ms": "IHPR Bulanan mengikut Seksyen (1 digit)",
    "description_en": "Monthly producer price index (PPI) by MSIC section (1 digit), with and without seasonal adjustment.",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan mengikut seksyen MSIC (1 digit), dengan dan tanpa pelarasan secara musim.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi_1d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi_1d.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi_sitc",
    "title_en": "Monthly PPI by SITC Section (1 digit)",
    "title_ms": "IHPR Bulanan mengikut Seksyen SITC (1 digit)",
    "description_en": "Monthly producer price index (PPI) by SITC section (1 digit).",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan mengikut seksyen SITC (1 digit).",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi_sitc.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi_sitc.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi_sop",
    "title_en": "Monthly PPI by Stage of Processing",
    "title_ms": "IHPR Bulanan mengikut Tahap Pemprosesan",
    "description_en": "Monthly producer price index (PPI) by stage of processing, per the SITC classification.",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan mengikut tahap pemprosesan, mengikut klasifikasi SITC.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi_sop.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi_sop.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "ppi",
    "title_en": "Monthly Producer Price Index (PPI)",
    "title_ms": "Indeks Harga Pengeluar (IHPR) Bulanan",
    "description_en": "Monthly headline producer price index (PPI), with and without seasonal adjustment.",
    "description_ms": "Indeks harga pengeluar (IHPR) bulanan keseluruhan, dengan dan tanpa pelarasan secara musim.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/ppi.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/ppi.csv",
    "last_updated": "2026-04-27 12:00",
    "data_as_of": "2026-03"
  },
  {
    "id": "fuelprice",
    "title_en": "Price of Petroleum & Diesel",
    "title_ms": "Harga Petrol & Diesel",
    "description_en": "Weekly retail prices of RON95 petrol, RON97 petrol, and diesel in Malaysia.",
    "description_ms": "Harga runcit mingguan bagi petrol RON95, petrol RON97 dan diesel di Malaysia.",
    "frequency": "WEEKLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2025,
    "data_source": [
      "MOF"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Commodity Prices",
    "subcategory_ms": "Harga Komoditi",
    "category_sort": 70,
    "link_parquet": "https://storage.data.gov.my/commodities/fuelprice.parquet",
    "link_csv": "https://storage.data.gov.my/commodities/fuelprice.csv",
    "last_updated": "2026-05-13 23:59",
    "data_as_of": "2026-05-14 00:01"
  },
  {
    "id": "lookup_item",
    "title_en": "PriceCatcher: Item Lookup",
    "title_ms": "PriceCatcher: Jadual Carian Barangan",
    "description_en": "Lookup table, to be left-joined against item code in the main PriceCatcher data.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan kod barang (item code) dalam dataset PriceCatcher utama.",
    "frequency": "INFREQUENT",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2025,
    "data_source": [
      "KPDN",
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.data.gov.my/pricecatcher/lookup_item.parquet",
    "link_csv": "https://storage.data.gov.my/pricecatcher/lookup_item.csv",
    "last_updated": "-",
    "data_as_of": "2023-11-09 23:59"
  },
  {
    "id": "lookup_premise",
    "title_en": "PriceCatcher: Premise Lookup",
    "title_ms": "PriceCatcher: Jadual Carian Premis",
    "description_en": "Lookup table, to be left-joined against premise code in the main PriceCatcher data.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan kod premis (premise code) dalam dataset PriceCatcher utama.",
    "frequency": "INFREQUENT",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2025,
    "data_source": [
      "KPDN",
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.data.gov.my/pricecatcher/lookup_premise.parquet",
    "link_csv": "https://storage.data.gov.my/pricecatcher/lookup_premise.csv",
    "last_updated": "2026-05-12 12:00",
    "data_as_of": "2026-05-11 23:59"
  },
  {
    "id": "pricecatcher",
    "title_en": "PriceCatcher: Transactional Records",
    "title_ms": "PriceCatcher: Rekod Transaksi",
    "description_en": "The table below provides a preview of the full dataset, which contains over a million price records per month. We recommend that you download and work with the data in your preferred coding environmen",
    "description_ms": "Jadual di bawah memberi pratonton kepada set data penuh, yang mengandungi lebih daripada sejuta rekod harga bagi setiap bulan. Kami sarankan anda memuat turun dan menganalisa data dengan menggunakan k",
    "frequency": "DAILY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2025,
    "data_source": [
      "KPDN",
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Consumer Prices",
    "subcategory_ms": "Harga Pengguna",
    "category_sort": 70,
    "link_parquet": "https://storage.data.gov.my/pricecatcher/pricecatcher_YYYY-MM-DD.parquet",
    "link_csv": "https://storage.data.gov.my/pricecatcher/pricecatcher_YYYY-MM-DD.csv",
    "last_updated": "2026-05-16 12:00",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "sppi_2d",
    "title_en": "SPPI by Division (2 digits)",
    "title_ms": "IHPR mengikut Bahagian (2 digit)",
    "description_en": "Services producer price index (SPPI) by MSIC division (2 digits).",
    "description_ms": "Indeks harga pengeluar perkhidmatan (IHPRP) mengikut bahagian MSIC (2 digit).",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/sppi_2d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/sppi_2d.csv",
    "last_updated": "2026-05-07 12:30",
    "data_as_of": "2026-Q1"
  },
  {
    "id": "sppi_3d",
    "title_en": "SPPI by Group (3 digits)",
    "title_ms": "IHPR mengikut Kumpulan (3 digit)",
    "description_en": "Services producer price index (SPPI) by MSIC group (3 digits). The table provides a preview of the full dataset using the most recent 4 quarters of data.",
    "description_ms": "Indeks harga pengeluar perkhidmatan (IHPRP) mengikut kumpulan MSIC (3 digit). Jadual memberi pratonton kepada set data penuh menggunakan data bagi 4 suku tahun terkini.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/sppi_3d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/sppi_3d.csv",
    "last_updated": "2026-05-07 12:30",
    "data_as_of": "2026-Q1"
  },
  {
    "id": "sppi_1d",
    "title_en": "SPPI by Section (1 digit)",
    "title_ms": "IHPR mengikut Seksyen (1 digit)",
    "description_en": "Services producer price index (SPPI) by MSIC section (1 digit).",
    "description_ms": "Indeks harga pengeluar perkhidmatan (IHPRP) mengikut seksyen MSIC (1 digit).",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Prices",
    "category_ms": "Harga",
    "subcategory_en": "Producer Prices",
    "subcategory_ms": "Harga Pengeluar",
    "category_sort": 70,
    "link_parquet": "https://storage.dosm.gov.my/ppi/sppi_1d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ppi/sppi_1d.csv",
    "last_updated": "2026-05-07 12:30",
    "data_as_of": "2026-Q1"
  },
  {
    "id": "federal_budget_moe",
    "title_en": "Annual Budget Allocation for the Ministry of Education",
    "title_ms": "Peruntukan Belanjawan Tahunan bagi Kementerian Pendidikan",
    "description_en": "Annual federal budget allocated to the Ministry of Education (B/P.63) with a breakdown by expenditure categories, including development expenditure (DE) and operating expenditure (OE).",
    "description_ms": "Belanjawan persekutuan tahunan yang diperuntukkan kepada Kementerian Pendidikan (B/P.63), dengan pecahan mengikut kategori perbelanjaan, termasuk perbelanjaan pembangunan (DE) dan perbelanjaan menguru",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "MOF"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/budget_allocation_moe.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/budget_allocation_moe.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "federal_budget_moh",
    "title_en": "Annual Budget Allocation for the Ministry of Health",
    "title_ms": "Peruntukan Belanjawan Tahunan bagi Kementerian Kesihatan",
    "description_en": "Annual federal budget allocated to the Ministry of Health (B/P.42) with a breakdown by expenditure categories, including development expenditure (DE) and operating expenditure (OE).",
    "description_ms": "Belanjawan persekutuan tahunan yang diperuntukkan kepada Kementerian Kesihatan (B/P.42), dengan pecahan mengikut kategori perbelanjaan, termasuk perbelanjaan pembangunan (DE) dan perbelanjaan mengurus",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "MOF"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/budget_allocation_moh.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/budget_allocation_moh.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "federal_finance_year_de",
    "title_en": "Annual Federal Government Development Expenditure by Function",
    "title_ms": "Perbelanjaan Pembangunan Tahunan Kerajaan Persekutuan mengikut Fungsi",
    "description_en": "Breakdown of annual Federal Government development expenditure by key sectors describing the area of impact of development projects.",
    "description_ms": "Pecahan perbelanjaan mengurus tahunan Kerajaan Persekutuan kepada sektor utama yang memperincikan keberhasilan projek pembangunan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_year_de.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_year_de.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2023"
  },
  {
    "id": "federal_finance_year",
    "title_en": "Annual Federal Government Finance",
    "title_ms": "Kewangan Tahunan Kerajaan Persekutuan",
    "description_en": "Annual revenue, operating and development expenditure, overall surplus/deficit, and sources of financing for the Federal Government of Malaysia.",
    "description_ms": "Hasil, perbelanjaan mengurus dan pembangunan, lebihan/kurangan keseluruhan, serta sumber kewangan secara tahunan bagi Kerajaan Persekutuan Malaysia.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_year.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_year.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2023"
  },
  {
    "id": "federal_finance_year_oe",
    "title_en": "Annual Federal Government Operating Expenditure by Object",
    "title_ms": "Perbelanjaan Mengurus Tahunan Kerajaan Persekutuan mengikut Objek",
    "description_en": "Breakdown of annual Federal Government operating expenditure into key categories.",
    "description_ms": "Pecahan perbelanjaan mengurus tahunan Kerajaan Persekutuan kepada kategori utama.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1979,
    "dataset_end": 2022,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_year_oe.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_year_oe.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2023"
  },
  {
    "id": "federal_finance_year_revenue",
    "title_en": "Annual Federal Government Revenue",
    "title_ms": "Hasil Tahunan Kerajaan Persekutuan",
    "description_en": "Annual Federal Government revenue from direct taxes, indirect taxes, non-tax sources, as well as non-revenue receipts.",
    "description_ms": "Hasil tahunan Kerajaan Persekutuan daripada cukai langsung, cukai tidak langsung, sumber bukan cukai, serta terimaan bukan hasil.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1970,
    "dataset_end": 2022,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_year_revenue.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_year_revenue.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2023"
  },
  {
    "id": "government_apps_downloads",
    "title_en": "Downloads of Government Mobile Applications",
    "title_ms": "Muat Turun bagi Aplikasi Mudah Alih Kerajaan",
    "description_en": "Download statistics for official government mobile applications across different platforms (Android, Huawei, iOS), including platform-specific counts.",
    "description_ms": "Statistik muat turun untuk aplikasi mudah alih rasmi kerajaan merentasi platform berbeza (Android, Huawei, iOS), termasuk jumlah muat turun bagi setiap platform.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Services",
    "subcategory_ms": "Perkhidmatan Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/government_apps_downloads.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/government_apps_downloads.csv",
    "last_updated": "2026-04-22 02:00",
    "data_as_of": "2026-04-21 23:59"
  },
  {
    "id": "local_authority_sex",
    "title_en": "Female Representation in Local Authorities",
    "title_ms": "Perwakilan Wanita dalam Pihak Berkuasa Tempatan",
    "description_en": "Proportion of women and men in Malaysian local authorities.",
    "description_ms": "Peratusan wanita dan lelaki dalam pihak berkuasa tempatan Malaysia.",
    "frequency": "ANNUAL",
    "geography": [
      "STATE",
      "DISTRICT"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2019,
    "dataset_end": 2022,
    "data_source": [
      "KPKT"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Service",
    "subcategory_ms": "Perkhidmatan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/local_authority_sex.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/local_authority_sex.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "parliament_sex",
    "title_en": "Female Representation in Parliament",
    "title_ms": "Peratus Wanita dalam Parlimen",
    "description_en": "Proportion of women and men in Malaysian Parliament, covering both the House of Representatives (Dewan Rakyat) and the Senate (Dewan Negara).",
    "description_ms": "Peratusan wanita dan lelaki dalam Parlimen Malaysia, merangkumi Dewan Rakyat dan Dewan Negara.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "Parlimen"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Service",
    "subcategory_ms": "Perkhidmatan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/parliament_sex.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/parliament_sex.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "government_apps_active",
    "title_en": "Number of Active Government Mobile Applications",
    "title_ms": "Jumlah Aplikasi Mudah Alih Rasmi Kerajaan yang Aktif",
    "description_en": "Monthly data on the number of active government mobile applications, including data on the number of apps published and shut down.",
    "description_ms": "Data bulanan mengenai bilangan aplikasi mudah alih rasmi kerajaan yang aktif, termasuk bilangan aplikasi yang diterbitkan dan ditutup.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Services",
    "subcategory_ms": "Perkhidmatan Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/government_apps_active.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/government_apps_active.csv",
    "last_updated": "2026-04-22 02:00",
    "data_as_of": "2026-04-21 23:59"
  },
  {
    "id": "domains",
    "title_en": "Number of Registered .MY Domains",
    "title_ms": "Bilangan Pendaftaran Domain .MY",
    "description_en": "Number of .MY domains registered with MYNIC Berhad.",
    "description_ms": "Bilangan domain .MY yang didaftarkan dengan MYNIC Berhad.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2007,
    "dataset_end": 2025,
    "data_source": [
      "MYNIC",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Infrastructure",
    "subcategory_ms": "Infrastruktur Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/domains.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/domains.csv",
    "last_updated": "2025-02-15 12:00",
    "data_as_of": "2025-01"
  },
  {
    "id": "domains_dnssec",
    "title_en": "Number of Registered .MY Domains with DNSSEC",
    "title_ms": "Bilangan Pendaftaran Domain .MY dengan DNSSEC",
    "description_en": "Number of .MY domains with DNSSEC registered with MYNIC Berhad.",
    "description_ms": "Bilangan domain .MY dengan DNSSEC yang didaftarkan dengan MYNIC Berhad.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2011,
    "dataset_end": 2025,
    "data_source": [
      "MYNIC",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Infrastructure",
    "subcategory_ms": "Infrastruktur Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/domains_dnssec.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/domains_dnssec.csv",
    "last_updated": "2025-02-15 12:00",
    "data_as_of": "2025-01"
  },
  {
    "id": "domains_ipv6",
    "title_en": "Number of Registered .MY Domains with IPv6 DNS",
    "title_ms": "Bilangan Pendaftaran Domain .MY dengan DNS IPv6",
    "description_en": "Number of .MY domains with IPv6 DNS registered with MYNIC Berhad.",
    "description_ms": "Bilangan domain .MY dengan DNS IPv6 yang didaftarkan dengan MYNIC Berhad.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2009,
    "dataset_end": 2024,
    "data_source": [
      "MYNIC",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Infrastructure",
    "subcategory_ms": "Infrastruktur Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/domains_ipv6.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/domains_ipv6.csv",
    "last_updated": "2025-02-15 12:00",
    "data_as_of": "2025-01"
  },
  {
    "id": "domains_idn",
    "title_en": "Number of Registered Internationalised .MY Domains",
    "title_ms": "Bilangan Pendaftaran Domain .MY yang Berinternasionalisasi",
    "description_en": "Number of internationalised .MY domains registered with MYNIC Berhad.",
    "description_ms": "Bilangan domain .MY berinternasionalisasi yang didaftarkan dengan MYNIC Berhad.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2011,
    "dataset_end": 2024,
    "data_source": [
      "MYNIC",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Infrastructure",
    "subcategory_ms": "Infrastruktur Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/domains_idn.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/domains_idn.csv",
    "last_updated": "2025-02-15 12:00",
    "data_as_of": "2025-01"
  },
  {
    "id": "federal_finance_qtr_de",
    "title_en": "Quarterly Federal Government Development Expenditure by Function",
    "title_ms": "Perbelanjaan Pembangunan Suku Tahunan Kerajaan Persekutuan mengikut Fungsi",
    "description_en": "Breakdown of quarterly Federal Government development expenditure by key sectors describing the area of impact of development projects.",
    "description_ms": "Pecahan perbelanjaan mengurus suku tahunan Kerajaan Persekutuan kepada sektor utama yang memperincikan keberhasilan projek pembangunan.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1996,
    "dataset_end": 2023,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_de.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_de.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2024-Q1"
  },
  {
    "id": "federal_finance_qtr",
    "title_en": "Quarterly Federal Government Finance",
    "title_ms": "Kewangan Suku Tahunan Kerajaan Persekutuan",
    "description_en": "Quarterly revenue, operating and development expenditure, overall surplus/deficit, and sources of financing for the Federal Government of Malaysia.",
    "description_ms": "Hasil, perbelanjaan mengurus dan pembangunan, lebihan/kurangan keseluruhan, serta sumber kewangan secara suku tahunan bagi Kerajaan Persekutuan Malaysia.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1996,
    "dataset_end": 2023,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_qtr.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_qtr.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2024-Q1"
  },
  {
    "id": "federal_finance_qtr_oe",
    "title_en": "Quarterly Federal Government Operating Expenditure by Object",
    "title_ms": "Perbelanjaan Mengurus Suku Tahunan Kerajaan Persekutuan mengikut Objek",
    "description_en": "Breakdown of quarterly Federal Government operating expenditure into key categories.",
    "description_ms": "Pecahan perbelanjaan mengurus suku tahunan Kerajaan Persekutuan kepada kategori utama.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1999,
    "dataset_end": 2023,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_oe.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_oe.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2024-Q1"
  },
  {
    "id": "federal_finance_qtr_revenue",
    "title_en": "Quarterly Federal Government Revenue",
    "title_ms": "Hasil Suku Tahunan Kerajaan Persekutuan",
    "description_en": "Quarterly Federal Government revenue from direct taxes, indirect taxes, non-tax sources, as well as non-revenue receipts.",
    "description_ms": "Hasil suku tahunan Kerajaan Persekutuan daripada cukai langsung, cukai tidak langsung, sumber bukan cukai, serta terimaan bukan hasil.",
    "frequency": "QUARTERLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1996,
    "dataset_end": 2023,
    "data_source": [
      "JANM"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_revenue.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_qtr_revenue.csv",
    "last_updated": "2024-05-31 15:00",
    "data_as_of": "2024-Q1"
  },
  {
    "id": "state_finance_expenditure",
    "title_en": "State Government Expenditure",
    "title_ms": "Perbelanjaan Kerajaan Negeri",
    "description_en": "Annual data on state government expenditure across various categories, including development expenditure (DE) and operating expenditure (OE).",
    "description_ms": "Data tahunan mengenai perbelanjaan kerajaan negeri dalam pelbagai kategori, termasuk perbelanjaan pembangunan (DE) dan perbelanjaan mengurus (OE).",
    "frequency": "ANNUAL",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2022,
    "data_source": [
      "AUDIT"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/state_finance_expenditure.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/state_finance_expenditure.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "state_finance_revenue",
    "title_en": "State Government Revenue",
    "title_ms": "Hasil Kerajaan Negeri",
    "description_en": "Annual data on state government revenue by source, covering tax, non-tax, and non-revenue receipts.",
    "description_ms": "Data tahunan mengenai hasil kerajaan negeri mengikut sumber, merangkumi cukai, bukan cukai, dan penerimaan bukan hasil.",
    "frequency": "ANNUAL",
    "geography": [
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2022,
    "dataset_end": 2022,
    "data_source": [
      "AUDIT"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Public Finance",
    "subcategory_ms": "Kewangan Awam",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/state_finance_revenue.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/state_finance_revenue.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "government_apps",
    "title_en": "Transactional Data: Official Government Mobile Applications",
    "title_ms": "Data Transaksi: Aplikasi Mudah Alih Rasmi Kerajaan",
    "description_en": "List of official government mobile applications registered with GAMMA, including their names, platforms, date of publication and purpose.",
    "description_ms": "Senarai aplikasi mudah alih rasmi kerajaan yang didaftarkan dalam GAMMA, termasuk nama, platform, tarikh penerbitan dan tujuan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Services",
    "subcategory_ms": "Perkhidmatan Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/government_apps.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/government_apps.csv",
    "last_updated": "2026-04-22 02:00",
    "data_as_of": "2026-04-21 23:59"
  },
  {
    "id": "government_apps_reviews",
    "title_en": "Transactional Data: User Reviews of Government Mobile Applications",
    "title_ms": "Data Transaksi: Ulasan Pengguna bagi Aplikasi Mudah Alih Kerajaan",
    "description_en": "Transactional data on the user reviews of government mobile applications",
    "description_ms": "Data transaksi mengenai ulasan pengguna bagi aplikasi mudah alih kerajaan",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Public Administration",
    "category_ms": "Pentadbiran Awam",
    "subcategory_en": "Digital Services",
    "subcategory_ms": "Perkhidmatan Digital",
    "category_sort": 80,
    "link_parquet": "https://storage.data.gov.my/publicadmin/government_apps_reviews.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/government_apps_reviews.csv",
    "last_updated": "2026-04-22 02:00",
    "data_as_of": "2026-04-21 23:59"
  },
  {
    "id": "crops_state",
    "title_en": "Crop Area and Production by State",
    "title_ms": "Keluasan dan Pengeluaran Tanaman mengikut Negeri",
    "description_en": "Production and planted area of crops by state from 2017 to 2022, broken down by crop type.",
    "description_ms": "Pengeluaran dan keluasan kawasan tanaman mengikut negeri dari 2017 hingga 2022, dengan pecahan mengikut jenis tanaman.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2022,
    "data_source": [
      "MAFS",
      "DOA",
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Agriculture",
    "subcategory_ms": "Pertanian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/agriculture/crops_state.parquet",
    "link_csv": "https://storage.data.gov.my/agriculture/crops_state.csv",
    "last_updated": "2023-12-31 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "crops_district_area",
    "title_en": "Crop Area by District",
    "title_ms": "Keluasan Tanaman mengikut Daerah",
    "description_en": "Planted area of crops by district, broken down by crop type and species. The table shows a preview of the dataset using the first 100 rows only, as the full dataset is over 10,000 rows in size.",
    "description_ms": "Keluasan kawasan tanaman mengikut daerah, dengan pecahan mengikut jenis dan spesies tanaman. Jadual menunjukkan pratonton set data dengan menggunakan 100 baris pertama sahaja, kerana set data penuh me",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2017,
    "data_source": [
      "MAFS",
      "DOA",
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Agriculture",
    "subcategory_ms": "Pertanian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/agriculture/crops_district_area.parquet",
    "link_csv": "https://storage.data.gov.my/agriculture/crops_district_area.csv",
    "last_updated": "2023-12-31 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "crops_district_production",
    "title_en": "Crop Production by District",
    "title_ms": "Pengeluaran Tanaman mengikut Daerah",
    "description_en": "Production of crops by district, broken down by crop type and species. The table shows a preview of the dataset using the first 100 rows only, as the full dataset is over 10,000 rows in size.",
    "description_ms": "Pengeluaran tanaman mengikut daerah, dengan pecahan mengikut jenis dan spesies tanaman. Jadual menunjukkan pratonton set data dengan menggunakan 100 baris pertama sahaja, kerana set data penuh melebih",
    "frequency": "YEARLY",
    "geography": [
      "DISTRICT"
    ],
    "demography": [],
    "dataset_begin": 2017,
    "dataset_end": 2017,
    "data_source": [
      "MAFS",
      "DOA",
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Agriculture",
    "subcategory_ms": "Pertanian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/agriculture/crops_district_production.parquet",
    "link_csv": "https://storage.data.gov.my/agriculture/crops_district_production.csv",
    "last_updated": "2023-12-31 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "mineral_extraction",
    "title_en": "Extraction of Minerals by State and Commodity",
    "title_ms": "Pengeluaran Mineral mengikut Negeri dan Komoditi",
    "description_en": "Annual extraction of mineral commodities by state from 2016 to 2021.",
    "description_ms": "Pengeluaran mineral komoditi tahunan mengikut negeri dari 2016 hingga 2021.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2021,
    "data_source": [
      "JMG",
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Mining & Quarrying",
    "subcategory_ms": "Perlombongan & Pengkuarian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/mining/mineral_extraction.parquet",
    "link_csv": "https://storage.data.gov.my/mining/mineral_extraction.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "trade_headline",
    "title_en": "Headline Monthly Trade in Goods",
    "title_ms": "Statistik Perdagangan Barangan Bulanan",
    "description_en": "Monthly exports, imports, total trade, and trade balance statistics for Malaysia.",
    "description_ms": "Statistik eksport, import, jumlah perdagangan, dan imbangan dagangan bulanan Malaysia.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "External Trade",
    "subcategory_ms": "Perdagangan Luar",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/trade/trade_headline.parquet",
    "link_csv": "https://storage.dosm.gov.my/trade/trade_headline.csv",
    "last_updated": "2026-04-28 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "iowrt",
    "title_en": "Headline Wholesale & Retail Trade",
    "title_ms": "Perdagangan Borong & Runcit Keseluruhan",
    "description_en": "Overall performance of the wholesale & retail trade subsectors, covering sales value and volume.",
    "description_ms": "Prestasi keseluruhan subsektor perdagangan borong & runcit, merangkumi nilai dan volum jualan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Services",
    "subcategory_ms": "Perkhidmatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/iowrt/iowrt.parquet",
    "link_csv": "https://storage.dosm.gov.my/iowrt/iowrt.csv",
    "last_updated": "2026-05-11 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi",
    "title_en": "Industrial Production Index (IPI)",
    "title_ms": "Indeks Pengeluaran Industri (IPP)",
    "description_en": "Real output of the three main industrial sectors, namely mining, manufacturing and electricity.",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama, iaitu perlombongan, pembuatan dan elektrik.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_2d",
    "title_en": "IPI by Division (2 digit)",
    "title_ms": "IPP mengikut Bahagian (2 digit)",
    "description_en": "Real output of the three main industrial sectors by MSIC division (2 digit). The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama mengikut bahagian MSIC (2 digit). Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_2d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_2d.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_3d",
    "title_en": "IPI by Group (3 digit)",
    "title_ms": "IPP mengikut Kumpulan (3 digit)",
    "description_en": "Real output of the three main industrial sectors by MSIC group (3 digit). The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama mengikut kumpulan MSIC (3 digit). Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_3d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_3d.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_5d",
    "title_en": "IPI by Item (5 digit)",
    "title_ms": "IPP mengikut Item (5 digit)",
    "description_en": "Real output of the three main industrial sectors by MSIC item (5 digit). The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama mengikut item MSIC (5 digit). Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini sahaja.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_5d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_5d.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_1d",
    "title_en": "IPI by Section (1 digit)",
    "title_ms": "IPP mengikut Seksyen (1 digit)",
    "description_en": "Real output of the three main industrial sectors by MSIC section (1 digit).",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama mengikut seksyen MSIC (1 digit).",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_1d.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_1d.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_domestic",
    "title_en": "IPI for Domestic-Oriented Divisions (2 digit)",
    "title_ms": "IPP bagi Bahagian Berorientasikan Domestik (2 digit)",
    "description_en": "Real output of the three main industrial sectors for specific MSIC divisions (2 digit) which are critical for Malaysia's domestic economic performance. The table provides a preview of the full dataset",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama bagi bahagian MSIC tertentu (2 digit) yang penting dalam memacu prestasi ekonomi domestik Malaysia. Jadual memberi pratonton kepada set data penuh d",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_domestic.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_domestic.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "ipi_export",
    "title_en": "IPI for Export-Oriented Divisions (2 digit)",
    "title_ms": "IPP bagi Bahagian Berorientasikan Eksport (2 digit)",
    "description_en": "Real output of the three main industrial sectors for specific MSIC divisions (2 digit) which are critical for Malaysia's export performance. The table provides a preview of the full dataset using the ",
    "description_ms": "Pengeluaran sebenar bagi tiga sektor industri utama bagi bahagian MSIC tertentu (2 digit) yang penting dalam memacu prestasi eksport Malaysia. Jadual memberi pratonton kepada set data penuh dengan men",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2015,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Manufacturing",
    "subcategory_ms": "Pembuatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/ipi/ipi_export.parquet",
    "link_csv": "https://storage.dosm.gov.my/ipi/ipi_export.csv",
    "last_updated": "2026-05-08 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "fish_landings",
    "title_en": "Monthly Landings of Marine Fish by State",
    "title_ms": "Pendaratan Ikan Laut Bulanan mengikut Negeri",
    "description_en": "Monthly landings of marine fish by state and coast from 2018 to 2023.",
    "description_ms": "Pendaratan ikan laut bulanan mengikut negeri dan pantai dari 2018 hingga 2023.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2023,
    "data_source": [
      "Perikanan"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Agriculture",
    "subcategory_ms": "Pertanian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/agriculture/fish_landings.parquet",
    "link_csv": "https://storage.data.gov.my/agriculture/fish_landings.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2023-12"
  },
  {
    "id": "trade_enduse_bec",
    "title_en": "Monthly Retained Imports by End Use and BEC",
    "title_ms": "Import Tertangguh Bulanan mengikut Penggunaan Akhir dan BEC",
    "description_en": "Monthly retained imports by end use and Broad Economic Categories (BEC).",
    "description_ms": "Import tertangguh bulanan mengikut penggunaan akhir dan Kategori Ekonomi Umum (BEC).",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2010,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "External Trade",
    "subcategory_ms": "Perdagangan Luar",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/trade/trade_enduse_bec.parquet",
    "link_csv": "https://storage.dosm.gov.my/trade/trade_enduse_bec.csv",
    "last_updated": "2026-04-28 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "trade_sitc_1d",
    "title_en": "Monthly Trade by SITC Section (1 digit)",
    "title_ms": "Perdagangan Bulanan mengikut Seksyen SITC (1 digit)",
    "description_en": "Monthly exports and imports by SITC commodity sections.",
    "description_ms": "Eksport dan import bulanan mengikut seksyen komoditi SITC.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "External Trade",
    "subcategory_ms": "Perdagangan Luar",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/trade/trade_sitc_1d.parquet",
    "link_csv": "https://storage.dosm.gov.my/trade/trade_sitc_1d.csv",
    "last_updated": "2026-04-28 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "timber_production",
    "title_en": "Production of Major Timber Products by State",
    "title_ms": "Pengeluaran Produk Utama Kayu mengikut Negeri",
    "description_en": "Production of major timber products by state from 2000 to 2021, broken down by product type.",
    "description_ms": "Pengeluaran produk utama kayu mengikut negeri dari 2000 hingga 2021, dengan pecahan mengikut jenis produk.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2000,
    "dataset_end": 2021,
    "data_source": [
      "Perhutanan",
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Agriculture",
    "subcategory_ms": "Pertanian",
    "category_sort": 90,
    "link_parquet": "https://storage.data.gov.my/agriculture/timber_products.parquet",
    "link_csv": "https://storage.data.gov.my/agriculture/timber_products.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2021"
  },
  {
    "id": "iowrt_2d",
    "title_en": "Wholesale & Retail Trade by Division (2 digit)",
    "title_ms": "Perdagangan Borong & Runcit mengikut Bahagian (2 digit)",
    "description_en": "Performance of the wholesale & retail trade subsectors by MSIC division (2 digit), covering sales value and volume.",
    "description_ms": "Prestasi subsektor perdagangan borong & runcit mengikut bahagian MSIC (2 digit), merangkumi nilai dan volum jualan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Services",
    "subcategory_ms": "Perkhidmatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/iowrt/iowrt_2d.parquet",
    "link_csv": "https://storage.dosm.gov.my/iowrt/iowrt_2d.csv",
    "last_updated": "2026-05-11 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "iowrt_3d",
    "title_en": "Wholesale & Retail Trade by Group (3 digit)",
    "title_ms": "Perdagangan Borong & Runcit mengikut Kumpulan (3 digit)",
    "description_en": "Performance of the wholesale & retail trade subsectors by MSIC group (3 digit), covering sales value and volume. The table provides a preview of the full dataset using the latest month of data only.",
    "description_ms": "Prestasi subsektor perdagangan borong & runcit mengikut kumpulan MSIC (3 digit), merangkumi nilai dan volum jualan. Jadual memberi pratonton kepada set data penuh dengan menggunakan data bulan terkini",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2024,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Economic Sectors",
    "category_ms": "Sektor Ekonomi",
    "subcategory_en": "Services",
    "subcategory_ms": "Perkhidmatan",
    "category_sort": 90,
    "link_parquet": "https://storage.dosm.gov.my/iowrt/iowrt_3d.parquet",
    "link_csv": "https://storage.dosm.gov.my/iowrt/iowrt_3d.csv",
    "last_updated": "2026-05-11 12:30",
    "data_as_of": "2026-03"
  },
  {
    "id": "economic_indicators",
    "title_en": "Malaysian Economic Indicators",
    "title_ms": "Indikator Ekonomi Malaysia",
    "description_en": "Indices for the purpose of monitoring Malaysia's economic situation on a monthly basis, consisting of leading, lagging, and coincidence indicators.",
    "description_ms": "Indeks bagi tujuan memantau kedudukan ekonomi semasa Malaysia. Index ini terdiri daripada indeks pelopor, serentak dan susulan.",
    "frequency": "MONTHLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 1991,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "Economic Indicators",
    "subcategory_ms": "Penunjuk Ekonomi",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/mei/mei.parquet",
    "link_csv": "https://storage.dosm.gov.my/mei/mei.csv",
    "last_updated": "2026-04-24 12:30",
    "data_as_of": "2026-02"
  },
  {
    "id": "sdg_03-3-1",
    "title_en": "SDG 03-3-1: HIV Incidence per 1,000 Uninfected Population",
    "title_ms": "SDG 03-3-1: Insiden HIV per 1,000 Penduduk Tidak dijangkiti",
    "description_en": "Number of new HIV infections per 1,000 uninfected population by sex, as per the specifications of SDG Indicator 3-3-1.",
    "description_ms": "Bilangan jangkitan HIV baharu bagi setiap 1,000 penduduk yang tidak dijangkiti mengikut jantina, selaras dengan spesifikasi Indikator SDG 3-3-1.",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL"
    ],
    "demography": [
      "SEX"
    ],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "MOH"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "SDG Indicators",
    "subcategory_ms": "Indikator SDG",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/sdg/sdg_03-3-1.parquet",
    "link_csv": "https://storage.dosm.gov.my/sdg/sdg_03-3-1.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "sdg_04-6-1",
    "title_en": "SDG 04-6-1: Proficiency in Functional Literacy and Numeracy",
    "title_ms": "SDG 04-6-1: Kemahiran Literasi dan Numerasi",
    "description_en": "Proportion of population in a given age group achieving at least a fixed level of proficiency in functional literacy and numeracy skills by state and sex, as per the specifications of SDG Indicator 4-",
    "description_ms": "Peratusan penduduk dalam kumpulan umur tertentu yang mencapai sekurang-kurangnya tahap kecekapan tetap dalam kemahiran literasi dan numerasi, mengikut negeri dan jantina, selaras dengan spesifikasi In",
    "frequency": "YEARLY",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "SDG Indicators",
    "subcategory_ms": "Indikator SDG",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/sdg/sdg_04-6-1.parquet",
    "link_csv": "https://storage.dosm.gov.my/sdg/sdg_04-6-1.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "sdg_10-c-1",
    "title_en": "SDG 10-C-1: Remittance Costs as a % of the Amount Remitted",
    "title_ms": "SDG 10-C-1: Kos Kiriman Wang sebagai % Jumlah Dikirim",
    "description_en": "Annual data on remittance costs as a proportion of the amount remitted, as per the specifications of SDG Indicator 10-C-1.",
    "description_ms": "Data tahunan mengenai kos kiriman wang sebagai peratusan jumlah yang dikirim, selaras dengan Indikator SDG 10-C-1.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "DOSM",
      "BNM"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "SDG Indicators",
    "subcategory_ms": "Indikator SDG",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/sdg/sdg_10-c-1.parquet",
    "link_csv": "https://storage.dosm.gov.my/sdg/sdg_10-c-1.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "sdg_16-1-1",
    "title_en": "SDG 16-1-1: Victims of Intentional Homicide",
    "title_ms": "SDG 16-1-1: Mangsa Pembunuhan",
    "description_en": "Number of victims of intentional homicide per 100,000 population by sex, as per the specifications of SDG Indicator 16-1-1.",
    "description_ms": "Bilangan mangsa pembunuhan secara sengaja bagi setiap 100,000 penduduk mengikut jantina, selaras dengan spesifikasi Indikator SDG 16-1-1.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL",
      "STATE"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "PDRM"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "SDG Indicators",
    "subcategory_ms": "Indikator SDG",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/sdg/sdg_16-1-1.parquet",
    "link_csv": "https://storage.dosm.gov.my/sdg/sdg_16-1-1.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "sdg_16-2-2",
    "title_en": "SDG 16-2-2: Victims of Human Trafficking",
    "title_ms": "SDG 16-2-2: Mangsa Pemerdagangan Manusia",
    "description_en": "Number of victims of human trafficking per 100,000 population by sex, age, and form of exploitation, as per the specifications of SDG Indicator 16-2-2.",
    "description_ms": "Bilangan mangsa pemerdagangan manusia bagi setiap 100,000 penduduk mengikut jantina, umur, dan bentuk pemerdagangan, selaras dengan spesifikasi Indikator SDG 16-2-2.",
    "frequency": "ANNUAL",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2016,
    "dataset_end": 2022,
    "data_source": [
      "KDN"
    ],
    "category_en": "Statistical Indicators",
    "category_ms": "Indikator Statistik",
    "subcategory_en": "SDG Indicators",
    "subcategory_ms": "Indikator SDG",
    "category_sort": 100,
    "link_parquet": "https://storage.dosm.gov.my/sdg/sdg_16-2-2.parquet",
    "link_csv": "https://storage.dosm.gov.my/sdg/sdg_16-2-2.csv",
    "last_updated": "2024-09-01 12:00",
    "data_as_of": "2022"
  },
  {
    "id": "bec",
    "title_en": "Broad Economic Categories (BEC)",
    "title_ms": "Kategori Ekonomi Umum (BEC)",
    "description_en": "This table provides a lookup for codes under the Broad Economic Categories (BEC) classification, as applied and used by publications in Malaysia. The BEC is primarily used by the Department of Statist",
    "description_ms": "Jadual ini memberi rujukan bagi kod yang terkandung dalam penjenisan Kategori Ekonomi Umum (BEC), seperti yang digunapakai dalam penerbitan data di Malaysia. BEC digunakan terutamanya oleh Jabatan Per",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2008,
    "dataset_end": 2008,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "National",
    "subcategory_ms": "Nasional",
    "category_sort": 110,
    "link_parquet": "https://storage.dosm.gov.my/dictionaries/bec.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/bec.csv",
    "last_updated": "2026-04-28",
    "data_as_of": "2026-03"
  },
  {
    "id": "currency_codes",
    "title_en": "Currency Codes (ISO 4217)",
    "title_ms": "Kod Mata Wang (ISO 4217)",
    "description_en": "ISO 4127-compliant lookup for currency codes used on the site.",
    "description_ms": "Rujukan standard untuk kod mata wang yang diguna dalam portal, yang mematuhi ISO 4217.",
    "frequency": "ONE-OFF",
    "geography": [],
    "demography": [],
    "dataset_begin": 2025,
    "dataset_end": 2025,
    "data_source": [
      "JDN"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "International",
    "subcategory_ms": "Antarabangsa",
    "category_sort": 110,
    "link_parquet": "https://storage.data.gov.my/finsector/exr/currency_codes.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/currency_codes.csv",
    "last_updated": "2025-10-24 11:32",
    "data_as_of": "2025"
  },
  {
    "id": "lookup_federal_finance",
    "title_en": "Lookup Table: Federal Finance",
    "title_ms": "Jadual Carian: Kewangan Persekutuan",
    "description_en": "Lookup table, to be left-joined against category and variable name in the other Federal Government Finance datasets if specified.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan kategori dan nama pembolehubah dalam set data Kewangan Kerajaan Persekutuan sekiranya diperlukan.",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "JANM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "Internal",
    "subcategory_ms": "Dalaman",
    "category_sort": 110,
    "link_parquet": "https://storage.data.gov.my/publicadmin/federal_finance_lookup.parquet",
    "link_csv": "https://storage.data.gov.my/publicadmin/federal_finance_lookup.csv",
    "last_updated": "2024-02-13 00:01",
    "data_as_of": "2024-01"
  },
  {
    "id": "lookup_money_banking",
    "title_en": "Lookup Table: Money & Banking",
    "title_ms": "Jadual Carian: Wang & Perbankan",
    "description_en": "Lookup table, to be left-joined against variable name in the other Money and Banking datasets if specified.",
    "description_ms": "Jadual carian, untuk dipadankan (left-join) dengan nama pembolehubah dalam set data Wang dan Perbankan sekiranya diperlukan.",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2024,
    "dataset_end": 2024,
    "data_source": [
      "BNM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "Internal",
    "subcategory_ms": "Dalaman",
    "category_sort": 110,
    "link_parquet": "https://storage.data.gov.my/finsector/money_banking_lookup.parquet",
    "link_csv": "https://storage.data.gov.my/finsector/money_banking_lookup.csv",
    "last_updated": "2024-02-13 00:01",
    "data_as_of": "2024-01"
  },
  {
    "id": "mcoicop",
    "title_en": "MCOICOP",
    "title_ms": "MCOICOP",
    "description_en": "This table provides a complete lookup for 2, 3, 4, and 5-digit codes under Malaysia's COICOP (Classification of Individual Consumption According to Purpose), as applied and used in data publications i",
    "description_ms": "Jadual ini memberi rujukan lengkap bagi kod 2, 3, 4 dan 5 digit dalam COICOP Malaysia (Classification of Individual Consumption According to Purpose), seperti yang digunapakai dalam penerbitan data di",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2018,
    "dataset_end": 2018,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "National",
    "subcategory_ms": "Nasional",
    "category_sort": 110,
    "link_parquet": "https://storage.dosm.gov.my/dictionaries/mcoicop.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/mcoicop.csv",
    "last_updated": "2024-04-16",
    "data_as_of": "2018"
  },
  {
    "id": "msic",
    "title_en": "MSIC",
    "title_ms": "MSIC",
    "description_en": "This table provides a complete lookup for the MSIC (Malaysian Standard Industrial Classification) 2008, as applied and used in data publications in Malaysia. The MSIC is primarily used by the Departme",
    "description_ms": "Jadual ini memberi rujukan lengkap bagi MSIC (Piawaian Klasifikasi Industri Malaysia) 2008, seperti yang digunapakai dalam penerbitan data di Malaysia. MCOICOP digunakan terutamanya oleh Jabatan Peran",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2008,
    "dataset_end": 2023,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "National",
    "subcategory_ms": "Nasional",
    "category_sort": 110,
    "link_parquet": "https://storage.dosm.gov.my/dictionaries/msic.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/msic.csv",
    "last_updated": "2008-12-31 23:59",
    "data_as_of": "2008"
  },
  {
    "id": "sitc",
    "title_en": "SITC",
    "title_ms": "SITC",
    "description_en": "This table provides a partial lookup for codes under the Standard International Trade Classification (SITC) Revision 4, as applied and used by publications in Malaysia. The SITC is primarily used by t",
    "description_ms": "Jadual ini memberi rujukan separuh lengkap bagi kod yang terkandung dalamn Piawai Penjenisan Perdagangan Antarabangsa (SITC) Pindaan 4, seperti yang digunapakai dalam penerbitan data di Malaysia. SITC",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2006,
    "dataset_end": 2006,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "National",
    "subcategory_ms": "Nasional",
    "category_sort": 110,
    "link_parquet": "https://storage.dosm.gov.my/dictionaries/sitc.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/sitc.csv",
    "last_updated": "2024-03-09",
    "data_as_of": "2006"
  },
  {
    "id": "sitc_sop",
    "title_en": "SITC: Stage of Processing",
    "title_ms": "SITC: Tahap Pemprosesan",
    "description_en": "This table provides a complete lookup for the classification of stage of processing, as applied and used by publications in Malaysia, primarily by DOSM.",
    "description_ms": "Jadual ini memberi rujukan lengkap bagi pengkelasan tahap pemprosesan, seperti yang digunapakai dalam penerbitan data di Malaysia, terutamanuya oleh DOSM.",
    "frequency": "INFREQUENT",
    "geography": [
      "NATIONAL"
    ],
    "demography": [],
    "dataset_begin": 2006,
    "dataset_end": 2006,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Data Dictionaries",
    "category_ms": "Kamus Data",
    "subcategory_en": "National",
    "subcategory_ms": "Nasional",
    "category_sort": 110,
    "link_parquet": "https://storage.dosm.gov.my/dictionaries/sitc_sop.parquet",
    "link_csv": "https://storage.dosm.gov.my/dictionaries/sitc_sop.csv",
    "last_updated": "2024-03-09",
    "data_as_of": "2006"
  },
  {
    "id": "usage_metrics_openapi_cumul",
    "title_en": "Cumulative OpenAPI Hits by Endpoint",
    "title_ms": "Penggunaan OpenAPI Kumulatif mengikut Endpoint",
    "description_en": "Total GET requests made to api.data.gov.my, disaggregated by endpoint.",
    "description_ms": "Permintaan GET keseluruhan kepada api.data.gov.my, dengan pecahan mengikut endpoint.",
    "frequency": "DAILY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Metrics",
    "subcategory_ms": "Metrik Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.data.gov.my/metrics/metrics_openapi_cumul.parquet",
    "link_csv": "https://storage.data.gov.my/metrics/metrics_openapi_cumul.csv",
    "last_updated": "2026-05-16 07:23",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "metrics_dataset_cumul",
    "title_en": "Cumulative Views and Downloads by Dataset",
    "title_ms": "Paparan dan Muat Turun Kumulatif mengikut Set Data",
    "description_en": "Total views and downloads of datasets on data.gov.my, disaggregated by dataset.",
    "description_ms": "Jumlah paparan dan muat turun set data di data.gov.my, dengan pecahan mengikut set data.",
    "frequency": "DAILY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Metrics",
    "subcategory_ms": "Metrik Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.data.gov.my/metrics/metrics_dataset_cumul.parquet",
    "link_csv": "https://storage.data.gov.my/metrics/metrics_dataset_cumul.csv",
    "last_updated": "2026-05-16 07:23",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "usage_metrics_openapi",
    "title_en": "Daily OpenAPI Hits by Endpoint",
    "title_ms": "Penggunaan OpenAPI Harian mengikut Endpoint",
    "description_en": "Daily GET requests made to api.data.gov.my, disaggregated by endpoint.",
    "description_ms": "Permintaan GET harian kepada api.data.gov.my, dengan pecahan mengikut endpoint.",
    "frequency": "DAILY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Metrics",
    "subcategory_ms": "Metrik Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.data.gov.my/metrics/metrics_openapi.parquet",
    "link_csv": "https://storage.data.gov.my/metrics/metrics_openapi.csv",
    "last_updated": "2026-05-16 07:23",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "usage_metrics",
    "title_en": "Daily Usage Metrics for data.gov.my",
    "title_ms": "Metrik Penggunaan Harian untuk data.gov.my",
    "description_en": "Total views, OpenAPI hits, and downloads for data.gov.my",
    "description_ms": "Jumlah paparan, penggunaan OpenAPI, dan muat turun bagi data.gov.my",
    "frequency": "DAILY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Metrics",
    "subcategory_ms": "Metrik Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.data.gov.my/metrics/metrics_agg.parquet",
    "link_csv": "https://storage.data.gov.my/metrics/metrics_agg.csv",
    "last_updated": "2026-05-16 07:23",
    "data_as_of": "2026-05-15 23:59"
  },
  {
    "id": "arc_dosm",
    "title_en": "DOSM's Advance Release Calendar",
    "title_ms": "Kalendar Awalan Keluaran DOSM",
    "description_en": "Release date and metadata for all DOSM's publications in 2026.",
    "description_ms": "Tarikh penerbitan serta metadata bagi semua penerbitan DOSM dalam tahun 2026.",
    "frequency": "DAILY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2026,
    "dataset_end": 2026,
    "data_source": [
      "DOSM"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Content",
    "subcategory_ms": "Kandungan Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.dosm.gov.my/meta/arc.parquet",
    "link_csv": "https://storage.dosm.gov.my/meta/arc.csv",
    "last_updated": "2026-05-16 07:59",
    "data_as_of": "2026-05-16 08:00"
  },
  {
    "id": "metrics_content",
    "title_en": "Number of Datasets on data.gov.my",
    "title_ms": "Bilangan Set Data di data.gov.my",
    "description_en": "Monthly and cumulative number of datasets published via the data catalogue",
    "description_ms": "Jumlah bilangan set data yang diterbitkan secara bulanan dan kumulatif di katalog data",
    "frequency": "MONTHLY",
    "geography": [],
    "demography": [],
    "dataset_begin": 2023,
    "dataset_end": 2026,
    "data_source": [
      "JDN",
      "KD"
    ],
    "category_en": "Metadata",
    "category_ms": "Metadata",
    "subcategory_en": "Site Metrics",
    "subcategory_ms": "Metrik Portal",
    "category_sort": 120,
    "link_parquet": "https://storage.data.gov.my/metrics/metrics_content.parquet",
    "link_csv": "https://storage.data.gov.my/metrics/metrics_content.csv",
    "last_updated": "2026-05-16 07:23",
    "data_as_of": "2026-05-15 23:59"
  }
] as const;
