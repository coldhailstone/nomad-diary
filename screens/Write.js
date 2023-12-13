import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import colors from '../colors';
import { useDB } from '../context';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const View = styled.View`
    background-color: ${colors.bgColor};
    flex: 1;
    padding: 0px 30px;
`;
const Title = styled.Text`
    color: ${colors.textColor};
    margin: 50px 0px;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
`;
const TextInput = styled.TextInput`
    background-color: white;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 18px;
`;
const Btn = styled.TouchableOpacity`
    width: 100%;
    margin-top: 30px;
    background-color: ${colors.btnColor};
    padding: 10px 20px;
    align-items: center;
    border-radius: 20px;
`;
const BtnText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 500;
`;
const Emotions = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;
const Emotion = styled.TouchableOpacity`
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    border-width: ${(props) => (props.selected ? '2px' : '0px')};
    border-color: rgba(0, 0, 0, 0.5);
`;
const EmotionText = styled.Text`
    font-size: 16px;
`;

const emotions = ['🤯', '🥲', '🤬', '🤗', '🥰', '😊', '🤩'];

const unitID = Platform.select({
    ios: 'ca-app-pub-5764958954883940/1227527585',
});
const adUnitId = __DEV__ ? TestIds.REWARDED : unitID;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

const Write = ({ navigation: { goBack } }) => {
    const realm = useDB();
    const [selectedEmotion, setEmotion] = useState(null);
    const [feelings, setFeelings] = useState('');
    const onChangeText = (text) => setFeelings(text);
    const onEmotionPress = (face) => setEmotion(face);

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
        });

        rewarded.load();

        return unsubscribeLoaded;
    }, []);

    const onSubmit = () => {
        if (!feelings || !selectedEmotion) {
            return Alert.alert('Please complete form.');
        }

        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                console.log(reward, selectedEmotion, feelings);
                realm.write(() => {
                    realm.create('Feeling', {
                        _id: Date.now(),
                        emotion: selectedEmotion,
                        message: feelings,
                    });
                });
                goBack();
                unsubscribeEarned();
            }
        );
        rewarded.show();
    };

    if (!loaded) {
        return null;
    }

    return (
        <View>
            <Title>How do you feel today?</Title>
            <Emotions>
                {emotions.map((emotion, index) => (
                    <Emotion
                        key={index}
                        selected={emotion === selectedEmotion}
                        onPress={() => onEmotionPress(emotion)}
                    >
                        <EmotionText>{emotion}</EmotionText>
                    </Emotion>
                ))}
            </Emotions>
            <TextInput
                placeholder='Write your feelings...'
                returnKeyType='done'
                value={feelings}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
            />
            <Btn onPress={onSubmit}>
                <BtnText>Save</BtnText>
            </Btn>
        </View>
    );
};

export default Write;
