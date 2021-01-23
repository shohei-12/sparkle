class CreateMeals < ActiveRecord::Migration[6.0]
  def change
    create_table :meals do |t|
      t.string :image
      t.string :type, null: false
      t.references :record, null: false, foreign_key: true

      t.timestamps
    end
  end
end
