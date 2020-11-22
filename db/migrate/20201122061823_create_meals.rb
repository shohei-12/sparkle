class CreateMeals < ActiveRecord::Migration[6.0]
  def change
    create_table :meals do |t|
      t.string :image
      t.time :time
      t.references :record, null: false, foreign_key: true
      t.references :eating_time, null: false, foreign_key: true

      t.timestamps
    end
  end
end
