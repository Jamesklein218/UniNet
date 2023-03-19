import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Icon, Text, Button} from '@components';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

export default function ActivityEventFilter(props) {
  const {colors} = useTheme();
  const backgroundColor = colors.background;
  const cardColor = colors.card;
  const {t} = useTranslation();
  const [sortOption, setSortOption] = useState(props.sortOption);
  const [sortSelected, setSortSelected] = useState(props.sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == sortSelected.value,
        };
      }),
    );
  }, []);

  const onSelectFilter = selected => {
    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  const onOpenSort = () => {
    setModalVisible(true);

    setSortOption(
      sortOption.map(item => {
        return {
          ...item,
          checked: item.value == sortSelected.value,
        };
      }),
    );
  };

  const onApply = () => {
    const {onChangeSort} = props;
    const sorted = sortOption.filter(item => item.checked);
    if (sorted.length > 0) {
      setSortSelected(sorted[0]);
      setModalVisible(false);
      onChangeSort(sorted[0]);
    }
  };

  const iconModeView = modeView => {
    switch (modeView) {
      case 'block':
        return 'square';
      case 'grid':
        return 'th-large';
      case 'list':
        return 'th-list';
      default:
        return 'th-list';
    }
  };

  const {style, modeView, onFilter, onChangeView, labelCustom} = props;
  const customAction =
    modeView != '' ? (
      <TouchableOpacity onPress={onChangeView} style={styles.contentModeView}>
        <Icon
          name={iconModeView(modeView)}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, {backgroundColor}, style]}>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setSortOption(props.sortOption);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: cardColor}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {sortOption.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}
              key={item.value}
              onPress={() => onSelectFilter(item)}>
              <Text body2 semibold primaryColor={item.checked}>
                {t(item.text)}
              </Text>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            full
            style={{marginTop: 10, marginBottom: 20}}
            onPress={() => onApply()}>
            {t('apply')}
          </Button>
        </View>
      </Modal>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card}}
        onPress={() => onOpenSort()}>
        <Text headline grayColor style={{marginLeft: 5}}>
          {t('choose_type')} : {t(sortSelected.text)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

ActivityEventFilter.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sortOption: PropTypes.array,
  sortSelected: PropTypes.object,
  modeView: PropTypes.string,
  labelCustom: PropTypes.string,
  onChangeSort: PropTypes.func,
  onChangeView: PropTypes.func,
  onFilter: PropTypes.func,
};

ActivityEventFilter.defaultProps = {
  style: {},
  sortOption: [

  ],
  sortSelected: {
    value: 0,
    text: "Participated Event",
  },
  modeView: '',
  labelCustom: '',
  onChangeSort: () => {},
  onChangeView: () => {},
  onFilter: () => {},
};
