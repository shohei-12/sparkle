class RemoveAppearanceFromRecords < ActiveRecord::Migration[6.0]
  def change
    remove_column :records, :appearance, :string
  end
end
