require 'rails_helper'

RSpec.describe Meal, type: :model do
  let(:meal) { build(:meal) }

  it 'return true' do
    expect(meal.valid?).to eq true
  end

  describe 'meal_type' do
    context 'when empty' do
      before { meal.meal_type = '' }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end

    context 'when not a specific value' do
      before { meal.meal_type = 'hoge' }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end
  end

  describe 'record_id' do
    context 'when empty' do
      before { meal.record_id = '' }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { meal.record_id += 1 }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end
  end
end
