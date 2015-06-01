class Assmaxzoomtouploadedmap < ActiveRecord::Migration
  def change
       change_table :uploadedmaps do |t|
         t.integer :maxzoom
         t.string :url
       end
  end
end
