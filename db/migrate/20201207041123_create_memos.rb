class CreateMemos < ActiveRecord::Migration[6.0]
  def change
    create_table :memos do |t|
      t.text :appearance
      t.text :breakfast
      t.text :lunch
      t.text :dinner
      t.text :snack
      t.references :record, index: { unique: true }, null: false, foreign_key: true

      t.timestamps
    end
  end
end
