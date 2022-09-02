import { rgb } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import _join from 'lodash/join';

import * as LayoutCreator from 'utils/networkanalysis/LayoutCreator';
import * as ClusteringCreator from 'utils/networkanalysis/ClusteringCreator';
import { getFullscreenOrBodyContainer } from 'utils/helpers';

// User interface.
export const urlPreviewPanelWidthExtent = [300, 600];
export const controlPanelWidth = 265;
export const controlPanelTabValues = {
  VIEW: 'view',
  FIND: 'find',
  UPDATE: 'update',
};
export const panelMargin = 12;
export const panelPadding = 8;
export const panelBackgroundColors = {
  LIGHT: 'white',
  DARK: '#212121',
};
export const legendPanelMaxWidth = 400;
export const legendStrokeColors = {
  LIGHT: 'white',
  DARK: '#2f2f2f'
};

// Visualization.
export const canvasMargin = 40;
export const circleMinDiameter = 5;
export const circleAvgDiameter = 16;
export const lineMinMaxWidth = [1, 28];
export const lineMinWidth = 0.1;
export const lineAvgWidth = 1.5;
export const labelMinFontSize = 9;
export const labelFontSizeScalingConstant = 4;
export const scoreColorLegendPropScoresBetweenMinAndMax = 0.8;
export const scoreColorLegendDesiredNTicks = 5;
export const zoomExtent = [0.5, 200];
export const zoomScaleFactor = 2;
export const itemZoomLevel = 3;
export const minNItems = 3;
export const visualizationBackgroundColors = {
  LIGHT: 'white',
  DARK: '#131313',
};
export const circleColors = {
  DEFAULT: '#ccc',
  TRANSITION_STRENTH_LIGHT_COLOR: 0.45,
  TRANSITION_STRENTH_DARK_COLOR: 0.15,
  TRANSITION_STRENTH_BORDER_COLOR: 0.05,
  TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND: 0.8,
  TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND: 0.8,
  ALPHA_DEFAULT: 0.7,
  ALPHA_HIGHLIGHTED: 1,
};
export const lineColors = {
  DEFAULT: '#ccc',
  TRANSITION_STRENTH: 0.4,
  TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND: 0.7,
  TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND: 0.6,
  ALPHA_DEFAULT: 0.4,
  ALPHA_HIGHLIGHTED: 0.8,
};
export const labelColors = {
  LIGHT_BACKGROUND: 'black',
  DARK_BACKGROUND: 'white',
  ALPHA_DEFAULT: 0.8,
  ALPHA_HIGHLIGHTED: 0.9,
  ALPHA_DIMMED: 0.3,
};
export const clusterColors = {
  DEFAULT: '#bfbfbf',
  LIGHT: [
    '#d62728',
    '#2ca02c',
    '#1f77b4',
    '#bcbd22',
    '#9467bd',
    '#17becf',
    '#ff7f0e',
    '#8c564b',
    '#e377c2',
    '#ff9896',
    '#98df8a',
    '#aec7e8',
    '#dbdb8d',
    '#c5b0d5',
    '#9edae5',
    '#ffbb78',
    '#c49c94',
    '#f7b6d2',
  ],
  DARK: [
    '#d62728',
    '#2ca02c',
    '#1f77b4',
    '#bcbd22',
    '#9467bd',
    '#17becf',
    '#ff7f0e',
    '#8c564b',
    '#e377c2',
    '#ff9896',
    '#98df8a',
    '#aec7e8',
    '#dbdb8d',
    '#c5b0d5',
    '#9edae5',
    '#ffbb78',
    '#c49c94',
    '#f7b6d2',
  ],
};
export const colorSchemes = {
  VIRIDIS: scaleLinear()
    .domain([0, 0.004830918, 0.009661836, 0.014492754, 0.019323671, 0.024154589, 0.028985507, 0.033816425, 0.038647343, 0.043478261, 0.048309179, 0.053140097, 0.057971014, 0.062801932, 0.06763285, 0.072463768, 0.077294686, 0.082125604, 0.086956522, 0.09178744, 0.096618357, 0.101449275, 0.106280193, 0.111111111, 0.115942029, 0.120772947, 0.125603865, 0.130434783, 0.1352657, 0.140096618, 0.144927536, 0.149758454, 0.154589372, 0.15942029, 0.164251208, 0.169082126, 0.173913043, 0.178743961, 0.183574879, 0.188405797, 0.193236715, 0.198067633, 0.202898551, 0.207729469, 0.212560386, 0.217391304, 0.222222222, 0.22705314, 0.231884058, 0.236714976, 0.241545894, 0.246376812, 0.251207729, 0.256038647, 0.260869565, 0.265700483, 0.270531401, 0.275362319, 0.280193237, 0.285024155, 0.289855072, 0.29468599, 0.299516908, 0.304347826, 0.309178744, 0.314009662, 0.31884058, 0.323671498, 0.328502415, 0.333333333, 0.338164251, 0.342995169, 0.347826087, 0.352657005, 0.357487923, 0.362318841, 0.367149758, 0.371980676, 0.376811594, 0.381642512, 0.38647343, 0.391304348, 0.396135266, 0.400966184, 0.405797101, 0.410628019, 0.415458937, 0.420289855, 0.425120773, 0.429951691, 0.434782609, 0.439613527, 0.444444444, 0.449275362, 0.45410628, 0.458937198, 0.463768116, 0.468599034, 0.473429952, 0.47826087, 0.483091787, 0.487922705, 0.492753623, 0.497584541, 0.502415459, 0.507246377, 0.512077295, 0.516908213, 0.52173913, 0.526570048, 0.531400966, 0.536231884, 0.541062802, 0.54589372, 0.550724638, 0.555555556, 0.560386473, 0.565217391, 0.570048309, 0.574879227, 0.579710145, 0.584541063, 0.589371981, 0.594202899, 0.599033816, 0.603864734, 0.608695652, 0.61352657, 0.618357488, 0.623188406, 0.628019324, 0.632850242, 0.637681159, 0.642512077, 0.647342995, 0.652173913, 0.657004831, 0.661835749, 0.666666667, 0.671497585, 0.676328502, 0.68115942, 0.685990338, 0.690821256, 0.695652174, 0.700483092, 0.70531401, 0.710144928, 0.714975845, 0.719806763, 0.724637681, 0.729468599, 0.734299517, 0.739130435, 0.743961353, 0.748792271, 0.753623188, 0.758454106, 0.763285024, 0.768115942, 0.77294686, 0.777777778, 0.782608696, 0.787439614, 0.792270531, 0.797101449, 0.801932367, 0.806763285, 0.811594203, 0.816425121, 0.821256039, 0.826086957, 0.830917874, 0.835748792, 0.84057971, 0.845410628, 0.850241546, 0.855072464, 0.859903382, 0.8647343, 0.869565217, 0.874396135, 0.879227053, 0.884057971, 0.888888889, 0.893719807, 0.898550725, 0.903381643, 0.90821256, 0.913043478, 0.917874396, 0.922705314, 0.927536232, 0.93236715, 0.937198068, 0.942028986, 0.946859903, 0.951690821, 0.956521739, 0.961352657, 0.966183575, 0.971014493, 0.975845411, 0.980676329, 0.985507246, 0.990338164, 0.995169082, 1])
    .range([rgb(66, 64, 134), rgb(66, 65, 134), rgb(65, 66, 135), rgb(65, 68, 135), rgb(64, 69, 136), rgb(64, 70, 136), rgb(63, 71, 136), rgb(63, 72, 137), rgb(62, 73, 137), rgb(62, 74, 137), rgb(62, 76, 138), rgb(61, 77, 138), rgb(61, 78, 138), rgb(60, 79, 138), rgb(60, 80, 139), rgb(59, 81, 139), rgb(59, 82, 139), rgb(58, 83, 139), rgb(58, 84, 140), rgb(57, 85, 140), rgb(57, 86, 140), rgb(56, 88, 140), rgb(56, 89, 140), rgb(55, 90, 140), rgb(55, 91, 141), rgb(54, 92, 141), rgb(54, 93, 141), rgb(53, 94, 141), rgb(53, 95, 141), rgb(52, 96, 141), rgb(52, 97, 141), rgb(51, 98, 141), rgb(51, 99, 141), rgb(50, 100, 142), rgb(50, 101, 142), rgb(49, 102, 142), rgb(49, 103, 142), rgb(49, 104, 142), rgb(48, 105, 142), rgb(48, 106, 142), rgb(47, 107, 142), rgb(47, 108, 142), rgb(46, 109, 142), rgb(46, 110, 142), rgb(46, 111, 142), rgb(45, 112, 142), rgb(45, 113, 142), rgb(44, 113, 142), rgb(44, 114, 142), rgb(44, 115, 142), rgb(43, 116, 142), rgb(43, 117, 142), rgb(42, 118, 142), rgb(42, 119, 142), rgb(42, 120, 142), rgb(41, 121, 142), rgb(41, 122, 142), rgb(41, 123, 142), rgb(40, 124, 142), rgb(40, 125, 142), rgb(39, 126, 142), rgb(39, 127, 142), rgb(39, 128, 142), rgb(38, 129, 142), rgb(38, 130, 142), rgb(38, 130, 142), rgb(37, 131, 142), rgb(37, 132, 142), rgb(37, 133, 142), rgb(36, 134, 142), rgb(36, 135, 142), rgb(35, 136, 142), rgb(35, 137, 142), rgb(35, 138, 141), rgb(34, 139, 141), rgb(34, 140, 141), rgb(34, 141, 141), rgb(33, 142, 141), rgb(33, 143, 141), rgb(33, 144, 141), rgb(33, 145, 140), rgb(32, 146, 140), rgb(32, 146, 140), rgb(32, 147, 140), rgb(31, 148, 140), rgb(31, 149, 139), rgb(31, 150, 139), rgb(31, 151, 139), rgb(31, 152, 139), rgb(31, 153, 138), rgb(31, 154, 138), rgb(30, 155, 138), rgb(30, 156, 137), rgb(30, 157, 137), rgb(31, 158, 137), rgb(31, 159, 136), rgb(31, 160, 136), rgb(31, 161, 136), rgb(31, 161, 135), rgb(31, 162, 135), rgb(32, 163, 134), rgb(32, 164, 134), rgb(33, 165, 133), rgb(33, 166, 133), rgb(34, 167, 133), rgb(34, 168, 132), rgb(35, 169, 131), rgb(36, 170, 131), rgb(37, 171, 130), rgb(37, 172, 130), rgb(38, 173, 129), rgb(39, 173, 129), rgb(40, 174, 128), rgb(41, 175, 127), rgb(42, 176, 127), rgb(44, 177, 126), rgb(45, 178, 125), rgb(46, 179, 124), rgb(47, 180, 124), rgb(49, 181, 123), rgb(50, 182, 122), rgb(52, 182, 121), rgb(53, 183, 121), rgb(55, 184, 120), rgb(56, 185, 119), rgb(58, 186, 118), rgb(59, 187, 117), rgb(61, 188, 116), rgb(63, 188, 115), rgb(64, 189, 114), rgb(66, 190, 113), rgb(68, 191, 112), rgb(70, 192, 111), rgb(72, 193, 110), rgb(74, 193, 109), rgb(76, 194, 108), rgb(78, 195, 107), rgb(80, 196, 106), rgb(82, 197, 105), rgb(84, 197, 104), rgb(86, 198, 103), rgb(88, 199, 101), rgb(90, 200, 100), rgb(92, 200, 99), rgb(94, 201, 98), rgb(96, 202, 96), rgb(99, 203, 95), rgb(101, 203, 94), rgb(103, 204, 92), rgb(105, 205, 91), rgb(108, 205, 90), rgb(110, 206, 88), rgb(112, 207, 87), rgb(115, 208, 86), rgb(117, 208, 84), rgb(119, 209, 83), rgb(122, 209, 81), rgb(124, 210, 80), rgb(127, 211, 78), rgb(129, 211, 77), rgb(132, 212, 75), rgb(134, 213, 73), rgb(137, 213, 72), rgb(139, 214, 70), rgb(142, 214, 69), rgb(144, 215, 67), rgb(147, 215, 65), rgb(149, 216, 64), rgb(152, 216, 62), rgb(155, 217, 60), rgb(157, 217, 59), rgb(160, 218, 57), rgb(162, 218, 55), rgb(165, 219, 54), rgb(168, 219, 52), rgb(170, 220, 50), rgb(173, 220, 48), rgb(176, 221, 47), rgb(178, 221, 45), rgb(181, 222, 43), rgb(184, 222, 41), rgb(186, 222, 40), rgb(189, 223, 38), rgb(192, 223, 37), rgb(194, 223, 35), rgb(197, 224, 33), rgb(200, 224, 32), rgb(202, 225, 31), rgb(205, 225, 29), rgb(208, 225, 28), rgb(210, 226, 27), rgb(213, 226, 26), rgb(216, 226, 25), rgb(218, 227, 25), rgb(221, 227, 24), rgb(223, 227, 24), rgb(226, 228, 24), rgb(229, 228, 25), rgb(231, 228, 25), rgb(234, 229, 26), rgb(236, 229, 27), rgb(239, 229, 28), rgb(241, 229, 29), rgb(244, 230, 30), rgb(246, 230, 32), rgb(248, 230, 33), rgb(251, 231, 35), rgb(253, 231, 37)])
    .clamp(true),
  PLASMA: scaleLinear()
    .domain([0, 0.004830918, 0.009661836, 0.014492754, 0.019323671, 0.024154589, 0.028985507, 0.033816425, 0.038647343, 0.043478261, 0.048309179, 0.053140097, 0.057971014, 0.062801932, 0.06763285, 0.072463768, 0.077294686, 0.082125604, 0.086956522, 0.09178744, 0.096618357, 0.101449275, 0.106280193, 0.111111111, 0.115942029, 0.120772947, 0.125603865, 0.130434783, 0.1352657, 0.140096618, 0.144927536, 0.149758454, 0.154589372, 0.15942029, 0.164251208, 0.169082126, 0.173913043, 0.178743961, 0.183574879, 0.188405797, 0.193236715, 0.198067633, 0.202898551, 0.207729469, 0.212560386, 0.217391304, 0.222222222, 0.22705314, 0.231884058, 0.236714976, 0.241545894, 0.246376812, 0.251207729, 0.256038647, 0.260869565, 0.265700483, 0.270531401, 0.275362319, 0.280193237, 0.285024155, 0.289855072, 0.29468599, 0.299516908, 0.304347826, 0.309178744, 0.314009662, 0.31884058, 0.323671498, 0.328502415, 0.333333333, 0.338164251, 0.342995169, 0.347826087, 0.352657005, 0.357487923, 0.362318841, 0.367149758, 0.371980676, 0.376811594, 0.381642512, 0.38647343, 0.391304348, 0.396135266, 0.400966184, 0.405797101, 0.410628019, 0.415458937, 0.420289855, 0.425120773, 0.429951691, 0.434782609, 0.439613527, 0.444444444, 0.449275362, 0.45410628, 0.458937198, 0.463768116, 0.468599034, 0.473429952, 0.47826087, 0.483091787, 0.487922705, 0.492753623, 0.497584541, 0.502415459, 0.507246377, 0.512077295, 0.516908213, 0.52173913, 0.526570048, 0.531400966, 0.536231884, 0.541062802, 0.54589372, 0.550724638, 0.555555556, 0.560386473, 0.565217391, 0.570048309, 0.574879227, 0.579710145, 0.584541063, 0.589371981, 0.594202899, 0.599033816, 0.603864734, 0.608695652, 0.61352657, 0.618357488, 0.623188406, 0.628019324, 0.632850242, 0.637681159, 0.642512077, 0.647342995, 0.652173913, 0.657004831, 0.661835749, 0.666666667, 0.671497585, 0.676328502, 0.68115942, 0.685990338, 0.690821256, 0.695652174, 0.700483092, 0.70531401, 0.710144928, 0.714975845, 0.719806763, 0.724637681, 0.729468599, 0.734299517, 0.739130435, 0.743961353, 0.748792271, 0.753623188, 0.758454106, 0.763285024, 0.768115942, 0.77294686, 0.777777778, 0.782608696, 0.787439614, 0.792270531, 0.797101449, 0.801932367, 0.806763285, 0.811594203, 0.816425121, 0.821256039, 0.826086957, 0.830917874, 0.835748792, 0.84057971, 0.845410628, 0.850241546, 0.855072464, 0.859903382, 0.8647343, 0.869565217, 0.874396135, 0.879227053, 0.884057971, 0.888888889, 0.893719807, 0.898550725, 0.903381643, 0.90821256, 0.913043478, 0.917874396, 0.922705314, 0.927536232, 0.93236715, 0.937198068, 0.942028986, 0.946859903, 0.951690821, 0.956521739, 0.961352657, 0.966183575, 0.971014493, 0.975845411, 0.980676329, 0.985507246, 0.990338164, 0.995169082, 1])
    .range([rgb(102, 0, 167), rgb(103, 0, 168), rgb(105, 0, 168), rgb(106, 0, 168), rgb(108, 0, 168), rgb(110, 0, 168), rgb(111, 0, 168), rgb(113, 0, 168), rgb(114, 1, 168), rgb(116, 1, 168), rgb(117, 1, 168), rgb(119, 1, 168), rgb(120, 1, 168), rgb(122, 2, 168), rgb(123, 2, 168), rgb(125, 3, 168), rgb(126, 3, 168), rgb(128, 4, 168), rgb(129, 4, 167), rgb(131, 5, 167), rgb(132, 5, 167), rgb(134, 6, 166), rgb(135, 7, 166), rgb(136, 8, 166), rgb(138, 9, 165), rgb(139, 10, 165), rgb(141, 11, 165), rgb(142, 12, 164), rgb(143, 13, 164), rgb(145, 14, 163), rgb(146, 15, 163), rgb(148, 16, 162), rgb(149, 17, 161), rgb(150, 19, 161), rgb(152, 20, 160), rgb(153, 21, 159), rgb(154, 22, 159), rgb(156, 23, 158), rgb(157, 24, 157), rgb(158, 25, 157), rgb(160, 26, 156), rgb(161, 27, 155), rgb(162, 29, 154), rgb(163, 30, 154), rgb(165, 31, 153), rgb(166, 32, 152), rgb(167, 33, 151), rgb(168, 34, 150), rgb(170, 35, 149), rgb(171, 36, 148), rgb(172, 38, 148), rgb(173, 39, 147), rgb(174, 40, 146), rgb(176, 41, 145), rgb(177, 42, 144), rgb(178, 43, 143), rgb(179, 44, 142), rgb(180, 46, 141), rgb(181, 47, 140), rgb(182, 48, 139), rgb(183, 49, 138), rgb(184, 50, 137), rgb(186, 51, 136), rgb(187, 52, 136), rgb(188, 53, 135), rgb(189, 55, 134), rgb(190, 56, 133), rgb(191, 57, 132), rgb(192, 58, 131), rgb(193, 59, 130), rgb(194, 60, 129), rgb(195, 61, 128), rgb(196, 62, 127), rgb(197, 64, 126), rgb(198, 65, 125), rgb(199, 66, 124), rgb(200, 67, 123), rgb(201, 68, 122), rgb(202, 69, 122), rgb(203, 70, 121), rgb(204, 71, 120), rgb(204, 73, 119), rgb(205, 74, 118), rgb(206, 75, 117), rgb(207, 76, 116), rgb(208, 77, 115), rgb(209, 78, 114), rgb(210, 79, 113), rgb(211, 81, 113), rgb(212, 82, 112), rgb(213, 83, 111), rgb(213, 84, 110), rgb(214, 85, 109), rgb(215, 86, 108), rgb(216, 87, 107), rgb(217, 88, 106), rgb(218, 90, 106), rgb(218, 91, 105), rgb(219, 92, 104), rgb(220, 93, 103), rgb(221, 94, 102), rgb(222, 95, 101), rgb(222, 97, 100), rgb(223, 98, 99), rgb(224, 99, 99), rgb(225, 100, 98), rgb(226, 101, 97), rgb(226, 102, 96), rgb(227, 104, 95), rgb(228, 105, 94), rgb(229, 106, 93), rgb(229, 107, 93), rgb(230, 108, 92), rgb(231, 110, 91), rgb(231, 111, 90), rgb(232, 112, 89), rgb(233, 113, 88), rgb(233, 114, 87), rgb(234, 116, 87), rgb(235, 117, 86), rgb(235, 118, 85), rgb(236, 119, 84), rgb(237, 121, 83), rgb(237, 122, 82), rgb(238, 123, 81), rgb(239, 124, 81), rgb(239, 126, 80), rgb(240, 127, 79), rgb(240, 128, 78), rgb(241, 129, 77), rgb(241, 131, 76), rgb(242, 132, 75), rgb(243, 133, 75), rgb(243, 135, 74), rgb(244, 136, 73), rgb(244, 137, 72), rgb(245, 139, 71), rgb(245, 140, 70), rgb(246, 141, 69), rgb(246, 143, 68), rgb(247, 144, 68), rgb(247, 145, 67), rgb(247, 147, 66), rgb(248, 148, 65), rgb(248, 149, 64), rgb(249, 151, 63), rgb(249, 152, 62), rgb(249, 154, 62), rgb(250, 155, 61), rgb(250, 156, 60), rgb(250, 158, 59), rgb(251, 159, 58), rgb(251, 161, 57), rgb(251, 162, 56), rgb(252, 163, 56), rgb(252, 165, 55), rgb(252, 166, 54), rgb(252, 168, 53), rgb(252, 169, 52), rgb(253, 171, 51), rgb(253, 172, 51), rgb(253, 174, 50), rgb(253, 175, 49), rgb(253, 177, 48), rgb(253, 178, 47), rgb(253, 180, 47), rgb(253, 181, 46), rgb(254, 183, 45), rgb(254, 184, 44), rgb(254, 186, 44), rgb(254, 187, 43), rgb(254, 189, 42), rgb(254, 190, 42), rgb(254, 192, 41), rgb(253, 194, 41), rgb(253, 195, 40), rgb(253, 197, 39), rgb(253, 198, 39), rgb(253, 200, 39), rgb(253, 202, 38), rgb(253, 203, 38), rgb(252, 205, 37), rgb(252, 206, 37), rgb(252, 208, 37), rgb(252, 210, 37), rgb(251, 211, 36), rgb(251, 213, 36), rgb(251, 215, 36), rgb(250, 216, 36), rgb(250, 218, 36), rgb(249, 220, 36), rgb(249, 221, 37), rgb(248, 223, 37), rgb(248, 225, 37), rgb(247, 226, 37), rgb(247, 228, 37), rgb(246, 230, 38), rgb(246, 232, 38), rgb(245, 233, 38), rgb(245, 235, 39), rgb(244, 237, 39), rgb(243, 238, 39), rgb(243, 240, 39), rgb(242, 242, 39), rgb(241, 244, 38), rgb(241, 245, 37), rgb(240, 247, 36), rgb(240, 249, 33)])
    .clamp(true),
  RAINBOW: scaleLinear()
    .domain([0, 0.33, 0.5, 0.66, 1])
    .range([rgb(0, 0, 255), rgb(0, 255, 255), rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0)])
    .clamp(true),
  YELLOW_GREEN_BLUE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 255, 217), rgb(237, 248, 177), rgb(199, 233, 180), rgb(127, 205, 187), rgb(65, 182, 196), rgb(29, 145, 192), rgb(34, 94, 168), rgb(37, 52, 148), rgb(8, 29, 88)])
    .clamp(true),
  PURPLE_BLUE_GREEN: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 247, 251), rgb(236, 226, 240), rgb(208, 209, 230), rgb(166, 189, 219), rgb(103, 169, 207), rgb(54, 144, 192), rgb(2, 129, 138), rgb(1, 108, 89), rgb(1, 70, 54)])
    .clamp(true),
  GREEN_BLUE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(247, 252, 240), rgb(224, 243, 219), rgb(204, 235, 197), rgb(168, 221, 181), rgb(123, 204, 196), rgb(78, 179, 211), rgb(43, 140, 190), rgb(8, 104, 172), rgb(8, 64, 129)])
    .clamp(true),
  PURPLE_BLUE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 247, 251), rgb(236, 231, 242), rgb(208, 209, 230), rgb(166, 189, 219), rgb(116, 169, 207), rgb(54, 144, 192), rgb(5, 112, 176), rgb(4, 90, 141), rgb(2, 56, 88)])
    .clamp(true),
  WHITE_YELLOW_GREEN_BLUE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 255, 255), rgb(255, 255, 217), rgb(237, 248, 177), rgb(199, 233, 180), rgb(127, 205, 187), rgb(65, 182, 196), rgb(29, 145, 192), rgb(34, 94, 168), rgb(37, 52, 148)])
    .clamp(true),
  WHITE_PURPLE_BLUE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 255, 255), rgb(255, 248, 252), rgb(237, 232, 243), rgb(209, 210, 231), rgb(167, 190, 220), rgb(116, 170, 208), rgb(54, 145, 193), rgb(5, 112, 177), rgb(4, 90, 142)])
    .clamp(true),
  WHITE_BLUE_PURPLE: scaleLinear()
    .domain([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1])
    .range([rgb(255, 255, 255), rgb(248, 253, 254), rgb(225, 237, 245), rgb(192, 212, 231), rgb(159, 189, 219), rgb(141, 151, 199), rgb(141, 107, 178), rgb(137, 65, 158), rgb(130, 15, 124)])
    .clamp(true),
  WHITE_YELLOW_ORANGE_RED: scaleLinear()
    .domain([0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857, 1])
    .range([rgb(255, 255, 255), rgb(255, 255, 204), rgb(255, 237, 160), rgb(254, 217, 118), rgb(254, 178, 76), rgb(253, 141, 60), rgb(252, 78, 42), rgb(227, 26, 28)])
    .clamp(true),
  SPECTRAL: scaleLinear()
    .domain([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
    .range([rgb(94, 79, 162), rgb(50, 136, 189), rgb(102, 194, 165), rgb(171, 221, 164), rgb(230, 245, 152), rgb(255, 255, 191), rgb(254, 224, 139), rgb(253, 174, 97), rgb(244, 109, 67), rgb(213, 62, 79), rgb(158, 1, 66)])
    .clamp(true),
  COOLWARM: scaleLinear()
    .domain([0, 0.03125, 0.0625, 0.09375, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125, 0.34375, 0.375, 0.40625, 0.4375, 0.46875, 0.5, 0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875, 0.71875, 0.75, 0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375, 0.96875, 1])
    .range([rgb(59, 76, 192), rgb(68, 90, 204), rgb(77, 104, 215), rgb(87, 117, 225), rgb(98, 130, 234), rgb(108, 142, 241), rgb(119, 154, 247), rgb(130, 165, 251), rgb(141, 176, 254), rgb(152, 185, 255), rgb(163, 194, 255), rgb(174, 201, 253), rgb(184, 208, 249), rgb(194, 213, 244), rgb(204, 217, 238), rgb(213, 219, 230), rgb(221, 221, 221), rgb(229, 216, 209), rgb(236, 211, 197), rgb(241, 204, 185), rgb(245, 196, 173), rgb(247, 187, 160), rgb(247, 177, 148), rgb(247, 166, 135), rgb(244, 154, 123), rgb(241, 141, 111), rgb(236, 127, 99), rgb(229, 112, 88), rgb(222, 96, 77), rgb(213, 80, 66), rgb(203, 62, 56), rgb(192, 40, 47), rgb(180, 4, 38)])
    .clamp(true),
};

// Parameters.
export const parameterKeys = {
  // Data.
  JSON: 'json',
  MAP: 'map',
  NETWORK: 'network',
  // Layout and clustering.
  ATTRACTION: 'attraction',
  LARGEST_COMPONENT: 'largest_component',
  MERGE_SMALL_CLUSTERS: 'merge_small_clusters',
  MIN_CLUSTER_SIZE: 'min_cluster_size',
  REPULSION: 'repulsion',
  RESOLUTION: 'resolution',
  // Visualization.
  COLORED_LINKS: 'colored_links',
  CURVED_LINKS: 'curved_links',
  DIMMING_EFFECT: 'dimming_effect',
  GRADIENT_CIRCLES: 'gradient_circles',
  ITEM_COLOR: 'item_color',
  ITEM_SIZE: 'item_size',
  ITEM_SIZE_VARIATION: 'item_size_variation',
  LINK_SIZE_VARIATION: 'link_size_variation',
  MAX_LABEL_LENGTH: 'max_label_length',
  MAX_N_LINKS: 'max_n_links',
  MAX_SCORE: 'max_score',
  MIN_LINK_STRENGTH: 'min_link_strength',
  MIN_SCORE: 'min_score',
  SCALE: 'scale',
  SCORE_COLORS: 'score_colors',
  SHOW_ITEM: 'show_item',
  ZOOM_LEVEL: 'zoom_level',
  // UI.
  DARK_UI: 'dark_ui',
  SHOW_INFO: 'show_info',
  SIMPLE_UI: 'simple_ui',
  URL_PREVIEW_PANEL: 'url_preview_panel',
};
export const defaultParameterValues = {
  // Data.
  [parameterKeys.JSON]: undefined,
  [parameterKeys.MAP]: undefined,
  [parameterKeys.NETWORK]: undefined,
  // Layout and clustering.
  [parameterKeys.ATTRACTION]: LayoutCreator.DEFAULT_ATTRACTION,
  [parameterKeys.LARGEST_COMPONENT]: undefined,
  [parameterKeys.MERGE_SMALL_CLUSTERS]: ClusteringCreator.DEFAULT_MERGE_SMALL_CLUSTERS,
  [parameterKeys.MIN_CLUSTER_SIZE]: ClusteringCreator.DEFAULT_MIN_CLUSTER_SIZE,
  [parameterKeys.REPULSION]: LayoutCreator.DEFAULT_REPULSION,
  [parameterKeys.RESOLUTION]: ClusteringCreator.DEFAULT_RESOLUTION,
  // Visualization.
  [parameterKeys.COLORED_LINKS]: true,
  [parameterKeys.CURVED_LINKS]: true,
  [parameterKeys.DIMMING_EFFECT]: true,
  [parameterKeys.GRADIENT_CIRCLES]: true,
  [parameterKeys.ITEM_COLOR]: undefined,
  [parameterKeys.ITEM_SIZE]: undefined,
  [parameterKeys.ITEM_SIZE_VARIATION]: 0.5,
  [parameterKeys.LINK_SIZE_VARIATION]: 0.5,
  [parameterKeys.MAX_LABEL_LENGTH]: 30,
  [parameterKeys.MAX_N_LINKS]: 1000,
  [parameterKeys.MAX_SCORE]: undefined,
  [parameterKeys.MIN_LINK_STRENGTH]: 0,
  [parameterKeys.MIN_SCORE]: undefined,
  [parameterKeys.SCALE]: 1,
  [parameterKeys.SCORE_COLORS]: 'viridis',
  [parameterKeys.SHOW_ITEM]: '',
  [parameterKeys.ZOOM_LEVEL]: undefined,
  // UI.
  [parameterKeys.DARK_UI]: false,
  [parameterKeys.SHOW_INFO]: false,
  [parameterKeys.SIMPLE_UI]: false,
  [parameterKeys.URL_PREVIEW_PANEL]: 0,
};

// Map data.
export const mapDataHeaders = {
  X: 'x',
  Y: 'y',
  ID: 'id',
  LABEL: 'label',
  CLUSTER: 'cluster'
};

// JSON data config.
export const defaultTerminology = {
  cluster: 'Cluster',
  clusters: 'Clusters',
  item: 'Item',
  items: 'Items',
  link: 'Link',
  links: 'Links',
  link_strength: 'Link strength',
  total_link_strength: 'Total link strength'
};
export const defaultTemplates = (itemHeading, linkHeading) => ({
  item_description: `
    <div class='description_heading'>${itemHeading}</div><div class='description_label'>{label}</div>
  `,
  link_description: `
    <div class='description_heading'>${linkHeading}</div><div class='description_label'>{source_label}</div><div class='description_label'>{target_label}</div>
  `
});
export const defaultStyles = (uiStyle) => ({
  description_heading: `
    label: description-heading;
    color: #757575;
    font-weight: 600;
  `,
  description_label: `
    label: description-label;
  `,
  description_text: `
    label: description-text;
    margin-bottom: 4px;
  `,
  description_url: `
    label: description-url;
    text-decoration: none;
    color: ${uiStyle.palette_primary_main_color};
    font-weight: 600;
  `,
});

// Data types.
export const dataTypeKeys = {
  VOSVIEWER_MAP_DATA: 'vosviewer-map-data',
  VOSVIEWER_NETWORK_DATA: 'vosviewer-network-data',
  VOSVIEWER_JSON_DATA: 'vosviewer-json-data',
};
export const dataTypeNames = {
  [dataTypeKeys.VOSVIEWER_MAP_DATA]: 'VOSviewer map data',
  [dataTypeKeys.VOSVIEWER_NETWORK_DATA]: 'VOSviewer network data',
  [dataTypeKeys.VOSVIEWER_JSON_DATA]: 'VOSviewer JSON data',
};

// Errors.
export const errorKeys = {
  // File errors.
  FILE_NOT_FOUND: 'file-not-found',
  FILE_READ_ERROR: 'file-read-error',
  // General data errors.
  NO_DATA: 'no-data',
  INCORRECT_USE_OF_QUOTES: 'incorrect-use-of-quotes',
  INCORRECT_N_COLUMNS: 'incorrect-n-columns',
  // VOSviewer map data errors.
  HEADER_MISSING: 'header-missing',
  MULTIPLE_COLUMNS: 'multiple-columns',
  ID_AND_LABEL_COLUMNS_MISSING: 'id-label-columns-missing',
  ID_COLUMN_MISSING: 'id-column-missing.',
  X_AND_Y_COLUMNS_MISSING: 'xy-columns-missing',
  // VOSviewer network data errors.
  LESS_THAN_TWO_COLUMNS_NETWORK_DATA: 'less-than-two-columns-network-data',
  MORE_THAN_THREE_COLUMNS_NETWORK_DATA: 'more-than-three-columns-network-data',
  INVALID_ID_NETWORK_DATA: 'invalid-id-network-data',
  // VOSviewer JSON data errors.
  INVALID_JSON_DATA_FORMAT: 'invalid-json-data-format',
  ID_ATTRIBUTE_MISSING: 'id-attribute-missing',
  ID_AND_LABEL_ATTRIBUTES_MISSING: 'id-label-attributes-missing',
  X_AND_Y_ATTRIBUTES_MISSING: 'xy-attributes-missing',
  SOURCE_ID_ATTRIBUTE_MISSING: 'source-id-attribute-missing.',
  TARGET_ID_ATTRIBUTE_MISSING: 'target-id-attribute-missing.',
  INVALID_SOURCE_ID_OR_TARGET_ID: 'invalid-source-id-target-id',
  // Item data errors.
  LESS_THAN_THREE_ITEMS: 'less-than-three-items',
  ID_EMPTY: 'id-empty',
  ID_NOT_UNIQUE: 'id-not-unique',
  ITEMS_SAME_COORDINATES: 'items-same-coordinates',
  X_OR_Y_NOT_NUMBER: 'xy-not-number',
  CLUSTER_NOT_POSITIVE_INTEGER: 'cluster-not-positive-integer',
  WEIGHT_NOT_NONNEGATIVE_NUMBER: 'weight-not-nonnegative-number',
  SCORE_NOT_NUMBER: 'score-not-number',
  // Link data errors.
  STRENGTH_NOT_NONNEGATIVE_NUMBER: 'strength-not-nonnegative-number',
};
export const errorMessages = {
  // File errors.
  [errorKeys.FILE_NOT_FOUND]: 'File cannot be found.',
  [errorKeys.FILE_READ_ERROR]: 'Re-select the file.',
  // General data errors.
  [errorKeys.NO_DATA]: 'No data found.',
  [errorKeys.INCORRECT_USE_OF_QUOTES]: 'Incorrect use of quotes.',
  // VOSviewer map data errors.
  [errorKeys.HEADER_MISSING]: 'Column header is empty.',
  [errorKeys.MULTIPLE_COLUMNS]: values => `Multiple ${_join(values, ', ')} columns`,
  [errorKeys.ID_AND_LABEL_COLUMNS_MISSING]: 'There must be an ID column or a LABEL column.',
  [errorKeys.ID_COLUMN_MISSING]: 'ID column is missing.',
  [errorKeys.X_AND_Y_COLUMNS_MISSING]: 'X and Y columns are missing.',
  [errorKeys.INCORRECT_N_COLUMNS]: 'Incorrect number of columns.',
  // VOSviewer network data errors.
  [errorKeys.LESS_THAN_TWO_COLUMNS_NETWORK_DATA]: 'There must be at least two columns.',
  [errorKeys.MORE_THAN_THREE_COLUMNS_NETWORK_DATA]: 'There must be at most three columns.',
  [errorKeys.INVALID_ID_NETWORK_DATA]: 'ID cannot be found in the map data.',
  // VOSviewer JSON data errors.
  [errorKeys.INVALID_JSON_DATA_FORMAT]: 'Invalid JSON data format.',
  [errorKeys.ID_AND_LABEL_ATTRIBUTES_MISSING]: 'An item must have an ID attribute or a LABEL attribute.',
  [errorKeys.ID_ATTRIBUTE_MISSING]: 'ID attribute of an item is missing.',
  [errorKeys.X_AND_Y_ATTRIBUTES_MISSING]: 'X and Y attributes of an item are missing.',
  [errorKeys.SOURCE_ID_ATTRIBUTE_MISSING]: 'SOURCE_ID attribute of a link is missing.',
  [errorKeys.TARGET_ID_ATTRIBUTE_MISSING]: 'TARGET_ID attribute of a link is missing.',
  [errorKeys.INVALID_SOURCE_ID_OR_TARGET_ID]: 'SOURCE_ID or TARGET_ID attribute of a link is invalid.',
  // Item data errors.
  [errorKeys.LESS_THAN_THREE_ITEMS]: 'There must be at least three items.',
  [errorKeys.ID_EMPTY]: 'Item without ID.',
  [errorKeys.ID_NOT_UNIQUE]: 'ID of an item must be unique.',
  [errorKeys.ITEMS_SAME_COORDINATES]: 'All items have the same coordinates.',
  [errorKeys.X_OR_Y_NOT_NUMBER]: 'Coordinates must be numbers.',
  [errorKeys.CLUSTER_NOT_POSITIVE_INTEGER]: 'Clusters must be represented by integers between 1 and 1000.',
  [errorKeys.WEIGHT_NOT_NONNEGATIVE_NUMBER]: 'Weights must be non-negative numbers.',
  [errorKeys.SCORE_NOT_NUMBER]: 'Scores must be numbers.',
  // Link data errors.
  [errorKeys.STRENGTH_NOT_NONNEGATIVE_NUMBER]: 'Strength of a link must be a non-negative number.',
};

// Processes.
export const processTypes = {
  READING_MAP_DATA: 'reading-map-data',
  READING_NETWORK_DATA: 'reading-network-data',
  READING_JSON_DATA: 'reading-json-data',
  PROCESSING_DATA: 'processing-data',
  RUNNING_LAYOUT: 'running-layout',
  RUNNING_CLUSTERING: 'running-clustering',
};
export const processDescriptions = {
  [processTypes.READING_MAP_DATA]: 'Reading VOSviewer map data...',
  [processTypes.READING_NETWORK_DATA]: 'Reading VOSviewer network data...',
  [processTypes.READING_JSON_DATA]: 'Reading VOSviewer JSON data...',
  [processTypes.PROCESSING_DATA]: 'Processing data...',
  [processTypes.RUNNING_LAYOUT]: 'Running layout algorithm...',
  [processTypes.RUNNING_CLUSTERING]: 'Running clustering algorithm...',
};

export const defaultMuiTheme = (isDark, uiStyle) => ({
  typography: {
    fontFamily: uiStyle.font_family,
    useNextVariants: true,
  },
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      default: isDark ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT,
      paper: isDark ? panelBackgroundColors.DARK : panelBackgroundColors.LIGHT,
    },
    primary: {
      main: uiStyle.palette_primary_main_color,
    },
  },
  components: {
    MuiMenu: {
      defaultProps: {
        container: () => getFullscreenOrBodyContainer(),
      },
    },
    MuiTooltip: {
      defaultProps: {
        PopperProps: {
          container: () => getFullscreenOrBodyContainer(),
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
          backgroundColor: 'transparent',
          '&:before': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0px 0px 12px',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          textTransform: 'none',
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          margin: '4px 0px 12px 0px',
          width: '100%',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiSlider: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          fontSize: '1.1rem',
        },
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
  }
});
