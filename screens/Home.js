import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import styled from 'styled-components/native';
import colors from '../colors';

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
`;
const BtnText = styled.Text`
    color: white;
`;

const Home = ({ navigation: { navigate } }) => (
    <View>
        <Title>My journal</Title>
        <Btn onPress={() => navigate('Write')}>
            <Ionicons name='add' color='white' size={40} />
        </Btn>
    </View>
);

export default Home;
