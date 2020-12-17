require 'rails_helper'

RSpec.describe Like, type: :model do
  let(:like) { build(:like) }

  it 'return true' do
    expect(like.valid?).to eq true
  end

  describe 'user_id' do
    context 'when empty' do
      before { like.user_id = '' }

      it 'return false' do
        expect(like.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { like.user_id += 2 }

      it 'return false' do
        expect(like.valid?).to eq false
      end
    end
  end

  describe 'record_id' do
    context 'when empty' do
      before { like.record_id = '' }

      it 'return false' do
        expect(like.valid?).to eq false
      end
    end

    context 'when record does not exist' do
      before { like.record_id += 1 }

      it 'return false' do
        expect(like.valid?).to eq false
      end
    end
  end
end
