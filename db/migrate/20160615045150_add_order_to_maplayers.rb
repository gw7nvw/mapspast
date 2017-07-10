class AddOrderToMaplayers < ActiveRecord::Migration
  def change
     change_table :maplayers do |t|
       t.integer :order
     end

  end
end
