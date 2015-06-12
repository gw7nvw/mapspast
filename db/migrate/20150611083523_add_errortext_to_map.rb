class AddErrortextToMap < ActiveRecord::Migration
  def change
   change_table :uploadedmaps do |t|
     t.string :errortext
   end
  end
end
