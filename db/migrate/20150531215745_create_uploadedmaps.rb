class CreateUploadedmaps < ActiveRecord::Migration
  def change
    create_table :uploadedmaps do |t|
      t.string :filename
      t.string :name
      t.string :series
      t.string :edition
      t.integer :scale
      t.string :sheet
      t.string :source
      t.string :attribution
      t.integer :year_printed
      t.integer :year_revised
      t.text :description
      t.integer :source_srid
      t.string :projection_name
      t.decimal :xresolution
      t.decimal :yresolution
      t.decimal :grid_xleft
      t.decimal :grid_xright
      t.decimal :grid_ytop
      t.decimal :grid_ybottom
      t.decimal :grid_width
      t.decimal :grid_height
      t.integer :pix_xleft
      t.integer :pix_xright
      t.integer :pix_ytop
      t.integer :pix_ybottom
      t.integer :pix_width
      t.integer :pix_height
      t.polygon :extent, :spatial => true, :srid => 4326
      t.integer :createdby_id
      t.timestamps
    end
  end
end
