class AddUploadedmapToMapseries < ActiveRecord::Migration
  def change
    change_table :mapsheets do |t|
      t.integer :uploadedmap_id
    end
  end
end
