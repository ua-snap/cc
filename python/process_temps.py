import pandas as pd

# TODO documentation
# This function is called by the message broker (process_wrapper.py).
def process_temps(days_window, max_temperature):
  # TODO use reference source for this data
  #csv = 'https://www.snap.uaf.edu/webshared/jschroder/WRF_extract_GFDL_1970-2100_FAI.csv'
  df = pd.read_csv('WRF_extract_GFDL_1970-2100_FAI.csv', index_col = 0)
  df.index = pd.to_datetime(df.index)
  x = df[df.rolling(int(days_window))['max'].max() <= max_temperature]
  dff = x.groupby(x.index.year)['max'].count().to_frame('occurences')
  return dff
