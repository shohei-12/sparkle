require 'rails_helper'

RSpec.describe Appearance, type: :model do
  let(:appearance) { create(:appearance) }

  it 'return true' do
    expect(appearance.valid?).to eq true
  end

  describe 'record_id' do
    context 'when empty' do
      before { appearance.record_id = '' }

      it 'return false' do
        expect(appearance.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { appearance.record_id += 1 }

      it 'return false' do
        expect(appearance.valid?).to eq false
      end
    end
  end
end
