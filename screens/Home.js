import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, LayoutAnimation, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import colors from '../colors';
import { useDB } from '../context';

const View = styled.View`
    flex: 1;
    padding: 0px 50px;
    padding-top: 100px;
    background-color: ${colors.bgColor};
`;
const Title = styled.Text`
    color: ${colors.textColor};
    font-size: 38px;
    margin-bottom: 100px;
`;
const Btn = styled.TouchableOpacity`
    position: absolute;
    bottom: 50px;
    right: 50px;
    height: 80px;
    width: 80px;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
    background-color: ${colors.btnColor};
    elevation: 5;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;
const BtnText = styled.Text`
    color: white;
`;
const Record = styled.View`
    background-color: ${colors.cardColor};
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    border-radius: 10px;
`;
const Emotion = styled.Text`
    font-size: 24px;
    margin-right: 10px;
`;
const Message = styled.Text`
    font-size: 18px;
`;
const Separator = styled.View`
    height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
    const realm = useDB();
    const [feelings, setFeelings] = useState(realm.objects('Feeling'));
    useEffect(() => {
        feelings.addListener((feelings) => {
            LayoutAnimation.spring();
            setFeelings(feelings.sorted('_id', true));
        });
        return () => {
            feelings.removeAllListeners();
        };
    }, []);
    const onPress = (id) => {
        realm.write(() => {
            const feeling = realm.objectForPrimaryKey('Feeling', id);
            realm.delete(feeling);
        });
    };

    return (
        <View>
            <Title>My journal2</Title>
            <FlatList
                ItemSeparatorComponent={Separator}
                contentContainerStyle={{ paddingVertical: 10 }}
                data={feelings}
                keyExtractor={(feeling) => feeling._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onPress(item._id)}>
                        <Record>
                            <Emotion>{item.emotion}</Emotion>
                            <Message>{item.message}</Message>
                        </Record>
                    </TouchableOpacity>
                )}
            />
            <Btn onPress={() => navigate('Write')}>
                <Ionicons name='add' color='white' size={40} />
            </Btn>
        </View>
    );
};

export default Home;
