import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';

type Operation = '+' | '-' | '*' | '/' | null;

const CalculatorScreen = () => {
  const [display, setDisplay] = useState<string>('0');
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [operation, setOperation] = useState<Operation>(null);
  const [previousNumber, setPreviousNumber] = useState<string | null>(null);

  const buttons: string[] = [
    'C',
    '+/-',
    '%',
    '/',
    '7',
    '8',
    '9',
    '*',
    '4',
    '5',
    '6',
    '-',
    '1',
    '2',
    '3',
    '+',
    '0',
    '.',
    '=',
  ];

  const handlePress = (button: string): void => {
    switch (button) {
      case 'C':
        setDisplay('0');
        setCurrentNumber('');
        setOperation(null);
        setPreviousNumber(null);
        break;
      case '+/-':
        setDisplay((parseFloat(display) * -1).toString());
        setCurrentNumber((parseFloat(currentNumber) * -1).toString());
        break;
      case '%':
        setDisplay((parseFloat(display) / 100).toString());
        setCurrentNumber((parseFloat(currentNumber) / 100).toString());
        break;
      case '=':
        if (operation && previousNumber !== null) {
          const result = calculate(previousNumber, currentNumber, operation);
          setDisplay(result.toString());
          setCurrentNumber(result.toString());
          setOperation(null);
          setPreviousNumber(null);
        }
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        setPreviousNumber(currentNumber);
        setOperation(button as Operation);
        setCurrentNumber('');
        setDisplay('0');
        break;
      default:
        if (display === '0' && button !== '.') {
          setDisplay(button);
          setCurrentNumber(button);
        } else {
          setDisplay(display + button);
          setCurrentNumber(currentNumber + button);
        }
        break;
    }
  };

  const calculate = (
    num1: string,
    num2: string,
    operation: Operation,
  ): string | number => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    switch (operation) {
      case '+':
        return n1 + n2;
      case '-':
        return n1 - n2;
      case '*':
        return n1 * n2;
      case '/':
        return n2 !== 0 ? n1 / n2 : 'K thể chia cho 0';
      default:
        return n2;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.display}
        value={display}
        editable={false}
        keyboardType="numeric"
      />
      <View style={styles.buttonsContainer}>
        {buttons.map(button => (
          <TouchableOpacity
            key={button}
            style={styles.button}
            onPress={() => handlePress(button)}
            accessibilityLabel={button}>
            <Text style={styles.buttonText}>{button}</Text>
            <Text>{}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  } as ViewStyle,
  display: {
    fontSize: 45,
    color: 'white',
    textAlign: 'right',
    margin: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  } as TextStyle,
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  } as ViewStyle,
  button: {
    width: '22%',
    height: 60,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  } as ViewStyle,
  buttonText: {
    fontSize: 24,
    color: '#fff',
  } as TextStyle,
});

export default CalculatorScreen;
