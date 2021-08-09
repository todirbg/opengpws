/*
 * CDDL HEADER START
 *
 * This file and its contents are supplied under the terms of the
 * Common Development and Distribution License ("CDDL"), version 1.0.
 * You may only use this file in accordance with the terms of version
 * 1.0 of the CDDL.
 *
 * A full copy of the text of the CDDL should have accompanied this
 * source.  A copy of the CDDL is also available via the Internet at
 * http://www.illumos.org/license/CDDL.
 *
 * CDDL HEADER END
*/
/*
 * Copyright 2018 Saso Kiselkov. All rights reserved.
 */

#version 460

#ifdef GL_EXT_gpu_shader4
#extension GL_EXT_gpu_shader4: enable
#endif


layout(location = 1) uniform sampler2D	tex;
layout(location = 2) uniform float		acf_elev_ft;
layout(location = 3) uniform vec2		hgt_rngs_ft[4];
layout(location = 7) uniform vec4		hgt_colors[4];

layout(location = 0) in vec2		tex_coord;
layout(location = 0) out vec4		color_out;

float
m2ft(float m)
{
	return (m * 3.2808398950131);
}

void
main()
{
	/*
	 * The elevation is stored in the red & green channels, offset by
	 * 10000m to avoid underflowing on negative elevations.
	 */
	vec4 pixel = texture(tex, tex_coord);
	float terr_elev_m = ((pixel.r * 255.0) + (pixel.g * 255 * 256)) - 10000;
	float terr_elev_ft = m2ft(terr_elev_m);
	float hgt_ft = acf_elev_ft - terr_elev_ft;

	for (int i = 0; i < 4; i++) {
		if (hgt_ft >= hgt_rngs_ft[i].x && hgt_ft < hgt_rngs_ft[i].y) {
			color_out = hgt_colors[i];
			return;
		}
	}
	color_out = vec4(0);
}
