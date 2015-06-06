class AddTics < ActiveRecord::Migration
  def change
    change_table :uploadedmaps do |t|
      t.integer :pix_xtl
      t.integer :pix_ytl
      t.integer :pix_xtr
      t.integer :pix_ytr
      t.integer :pix_xbr
      t.integer :pix_ybr
      t.integer :pix_xbl
      t.integer :pix_ybl
      t.integer :pix_xtic1
      t.integer :pix_ytic1
      t.integer :pix_xtic2
      t.integer :pix_ytic2
      t.decimal :grid_xtic1
      t.decimal :grid_ytic1
      t.decimal :grid_xtic2
      t.decimal :grid_ytic2
      t.decimal :pix_rotation
      t.decimal :deg_rotation
      t.boolean :crop_done
      t.boolean :rotate_done
    end

  end
end
