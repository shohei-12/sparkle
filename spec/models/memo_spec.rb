require 'rails_helper'

RSpec.describe Memo, type: :model do
  let(:memo1) { build(:memo) }
  let(:memo2) { create(:memo) }

  it 'return true' do
    expect(memo1.valid?).to eq true
  end

  describe 'record_id' do
    context 'when empty' do
      before { memo1.record_id = '' }

      it 'return false' do
        expect(memo1.valid?).to eq false
      end
    end

    context 'when duplicate' do
      before { memo1.record_id = memo2.record_id }

      it 'return false' do
        expect(memo1.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { memo1.record_id += 1 }

      it 'return false' do
        expect(memo1.valid?).to eq false
      end
    end
  end
end
