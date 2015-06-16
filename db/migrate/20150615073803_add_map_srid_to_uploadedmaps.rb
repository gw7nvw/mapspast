class AddMapSridToUploadedmaps < ActiveRecord::Migration
  def change
     change_table :uploadedmaps do |t|
       t.integer :map_srid
     end
  end
end
