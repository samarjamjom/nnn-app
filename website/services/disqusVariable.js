/*
    NNN website.

    This file is part of the NNN website.

    Authors:
        Ibrahim Abusamarah <ibrahim.abusamrah123@gmail.com>

    File description:
 */


/*
 *    disqus config
 *
 *    @tparam:
 *
 *    @param:
 *
 *    @returns
 */
export function disqus_config(x) {
    let config = {
            language: 'ar',
            tpage: 'http://example.com/postid=' + x
        }
        // Replace PAGE_URL with your page's canonical URL variable this.page.identifier = 'postid=1'; // Replace PAGE_IDENTIFIER with your page's unique identifier
    console.log("disqus_config Excecuted");
    localStorage.setItem('config', JSON.stringify(config));
};
