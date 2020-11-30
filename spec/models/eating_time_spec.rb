require 'rails_helper'

RSpec.describe EatingTime, type: :model do
  let(:eating_time) { build(:eating_time) }

  it 'return true' do
    expect(eating_time.valid?).to eq true
  end

  describe 'name' do
    context 'when empty' do
      before { eating_time.name = '' }

      it 'return false' do
        expect(eating_time.valid?).to eq false
      end
    end
  end
end
