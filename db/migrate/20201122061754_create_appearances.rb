class CreateAppearances < ActiveRecord::Migration[6.0]
  def change
    create_table :appearances do |t|
      t.string :image
      t.references :record, null: false, foreign_key: true

      t.timestamps
    end
  end
end
