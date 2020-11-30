require 'rails_helper'

RSpec.describe Record, type: :model do
  let(:record) { create(:record) }

  it 'return true' do
    expect(record.valid?).to eq true
  end

  describe 'date' do
    context 'when empty' do
      before { record.date = '' }

      it 'return false' do
        expect(record.valid?).to eq false
      end
    end
  end

  describe 'user_id' do
    context 'when empty' do
      before { record.user_id = '' }

      it 'return false' do
        expect(record.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { record.user_id += 1 }

      it 'return false' do
        expect(record.valid?).to eq false
      end
    end
  end
end
