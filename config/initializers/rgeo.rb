# config/initializers/rgeo.rb
RGeo::ActiveRecord::SpatialFactoryStore.instance.tap do |config|
  # Configure your global default spatial factory to use WGS84 (SRID 4326)
  config.default = RGeo::Geographic.spherical_factory(srid: 4326)
  
  # If you have specific spatial column data types you want to target:
  # config.register(RGeo::Geographic.spherical_factory(srid: 4326), geo_type: "geometry")
end
