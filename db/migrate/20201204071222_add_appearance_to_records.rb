class AddAppearanceToRecords < ActiveRecord::Migration[6.0]
  def change
    add_column :records, :appearance, :string
  end
end
