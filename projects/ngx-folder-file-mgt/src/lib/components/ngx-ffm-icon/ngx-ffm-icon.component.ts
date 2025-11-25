import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, Injector, input, OnInit, PLATFORM_ID, runInInjectionContext } from '@angular/core';

// 图标配置（可根据实际项目抽离到单独文件）
const ICONFONT_CONFIG = {
  symbolUrl: 'assets/iconfont/iconfont.js',
};
@Component({
  selector: 'ngx-ffm-icon',
  imports: [CommonModule],
  templateUrl: './ngx-ffm-icon.component.html',
  styleUrl: './ngx-ffm-icon.component.css',
  host: {
    ngSkipHydration: 'true', // 跳过 hydration 校验
  },
})
export class NgxFfmIconComponent implements OnInit {
  // 输入属性
  public readonly iconName = input.required<string>(); // 必传的图标名称（如 "icon-cuowushuju"）
  public readonly size = input<number>(16); // 图标大小（默认16px）
  public readonly color = input<string>(); // 图标颜色（可选）
  public readonly customClass = input<string>(''); // 自定义样式类（默认空）

  // 内部状态
  isLoaded = false;
  private isLoading = false;
  isBrowser = false;

  constructor(
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // 判断是否为浏览器环境
  }

  ngOnInit(): void {
    if (this.isBrowser) { // 仅在浏览器加载脚本（服务器端不执行）
      this.loadIconfontScript();
    }
  }

  /** 动态加载图标脚本 */
  private loadIconfontScript(): void {
    if (this.isLoaded || this.isLoading) return;
    this.isLoading = true;

    // 检查本地脚本是否已加载
    const existingScript = document.querySelector(`script[src="${ICONFONT_CONFIG.symbolUrl}"]`);
    if (existingScript) {
      this.handleScriptLoaded();
      return;
    }

    runInInjectionContext(this.injector, () => {
      const script = document.createElement('script');
      script.src = ICONFONT_CONFIG.symbolUrl; // 本地路径
      script.type = 'text/javascript';

      script.onload = () => this.handleScriptLoaded();
      script.onerror = (err) => {
        console.error('本地图标脚本加载失败（检查路径是否正确）:', err);
        this.isLoading = false;
      };

      document.head.appendChild(script);
    });
  }

  private handleScriptLoaded(): void {
    this.isLoaded = true;
    this.isLoading = false;
  }
}
