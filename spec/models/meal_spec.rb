require 'rails_helper'

RSpec.describe Meal, type: :model do
  let(:meal) { build(:meal) }

  it 'return true' do
    expect(meal.valid?).to eq true
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

  describe 'eating_time_id' do
    context 'when empty' do
      before { meal.eating_time_id = '' }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end

    context 'when eating_time does not exist' do
      before { meal.eating_time_id += 1 }

      it 'return false' do
        expect(meal.valid?).to eq false
      end
    end
  end
end
