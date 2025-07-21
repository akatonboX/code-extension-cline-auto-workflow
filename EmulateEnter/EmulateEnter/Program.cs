using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Threading;

namespace EmulateEnter
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // アクティブなウィンドウのハンドルを取得
            IntPtr hWnd = GetForegroundWindow();

            // エンターキーの仮想キーコード
            const int WM_KEYDOWN = 0x0100;
            const int WM_KEYUP = 0x0101;
            const int VK_RETURN = 0x0D;

            // エンターキー押下
            PostMessage(hWnd, WM_KEYDOWN, VK_RETURN, 0);
            // エンターキー離す
            PostMessage(hWnd, WM_KEYUP, VK_RETURN, 0);
        }

        // Win32 APIのPostMessage関数をインポート
        [DllImport("user32.dll")]
        private static extern bool PostMessage(IntPtr hWnd, int msg, int wParam, int lParam);

        // アクティブウィンドウのハンドルを取得するAPI
        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();
    }
}
